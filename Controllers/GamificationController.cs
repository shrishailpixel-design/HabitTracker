using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Api.Data;
using Project.Api.Models;

namespace Project.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamificationController : ControllerBase
{
    private readonly AppDbContext _db;

    public GamificationController(AppDbContext db) => _db = db;

    private static int XpForLevel(int level) => level switch
    {
        1 => 0,
        2 => 100,
        3 => 300,
        4 => 600,
        5 => 1000,
        6 => 1500,
        7 => 2100,
        8 => 2800,
        9 => 3600,
        _ => 3600 + (level - 9) * 1000
    };

    [HttpGet("profile")]
    public async Task<ActionResult<ProfileResponse>> GetProfile()
    {
        var profile = await GetOrCreateProfile();
        return Ok(ToProfileResponse(profile));
    }

    [HttpPost("pet")]
    public async Task<ActionResult<ProfileResponse>> SetPetType([FromBody] SetPetRequest request)
    {
        var profile = await GetOrCreateProfile();
        profile.PetType = request.PetType;
        await _db.SaveChangesAsync();
        return Ok(ToProfileResponse(profile));
    }

    [HttpPost("complete-goal")]
    public async Task<ActionResult<ProfileResponse>> CompleteGoal()
    {
        var profile = await GetOrCreateProfile();
        AddXp(profile, 50);
        profile.GoalsCompleted++;
        CheckBadges(profile);

        profile.PetLevel = 1 + profile.GoalsCompleted / 3;
        if (profile.PetLevel > 10) profile.PetLevel = 10;

        await _db.SaveChangesAsync();
        return Ok(ToProfileResponse(profile));
    }

    [HttpGet("quests")]
    public async Task<ActionResult<List<QuestResponse>>> GetQuests()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var existing = await _db.DailyQuests.Where(q => q.Date == today).ToListAsync();

        if (existing.Count == 0)
        {
            var quests = new List<DailyQuest>
            {
                new() { Description = "Complete a habit goal", XpReward = 50, Date = today, QuestType = "complete_goal" },
                new() { Description = "Check in for the day", XpReward = 10, Date = today, QuestType = "log_in" },
            };
            _db.DailyQuests.AddRange(quests);
            await _db.SaveChangesAsync();
            existing = quests;
        }

        return Ok(existing.Select(q => new QuestResponse
        {
            Id = q.Id,
            Description = q.Description,
            XpReward = q.XpReward,
            IsCompleted = q.IsCompleted,
        }).ToList());
    }

    [HttpPost("quests/{id}/complete")]
    public async Task<ActionResult<ProfileResponse>> CompleteQuest(int id)
    {
        var quest = await _db.DailyQuests.FindAsync(id);
        if (quest is null || quest.IsCompleted) return BadRequest(new { error = "Quest already completed or not found" });

        var profile = await GetOrCreateProfile();
        quest.IsCompleted = true;
        AddXp(profile, quest.XpReward);
        profile.DailyQuestsCompleted++;
        CheckBadges(profile);

        await _db.SaveChangesAsync();
        return Ok(ToProfileResponse(profile));
    }

    [HttpGet("boss")]
    public async Task<ActionResult<BossResponse>> GetBoss()
    {
        var week = GetWeekNumber();
        var boss = await _db.WeeklyBosses.FirstOrDefaultAsync(b => b.WeekNumber == week);

        if (boss is null)
        {
            boss = new WeeklyBoss
            {
                Name = RandomBossName(),
                Hp = 200,
                MaxHp = 200,
                DamagePerHit = 25,
                IsDefeated = false,
                WeekNumber = week
            };
            _db.WeeklyBosses.Add(boss);
            await _db.SaveChangesAsync();
        }

        return Ok(new BossResponse
        {
            Id = boss.Id,
            Name = boss.Name,
            Hp = boss.Hp,
            MaxHp = boss.MaxHp,
            DamagePerHit = boss.DamagePerHit,
            IsDefeated = boss.IsDefeated
        });
    }

    [HttpPost("boss/attack")]
    public async Task<ActionResult<BossResponse>> AttackBoss()
    {
        var week = GetWeekNumber();
        var boss = await _db.WeeklyBosses.FirstOrDefaultAsync(b => b.WeekNumber == week);

        if (boss is null) return BadRequest(new { error = "No boss this week" });
        if (boss.IsDefeated) return BadRequest(new { error = "Boss already defeated" });

        boss.Hp -= boss.DamagePerHit;
        if (boss.Hp <= 0)
        {
            boss.Hp = 0;
            boss.IsDefeated = true;

            var profile = await GetOrCreateProfile();
            AddXp(profile, 200);
            CheckBadges(profile);
            await _db.SaveChangesAsync();
        }

        await _db.SaveChangesAsync();

        return Ok(new BossResponse
        {
            Id = boss.Id,
            Name = boss.Name,
            Hp = boss.Hp,
            MaxHp = boss.MaxHp,
            DamagePerHit = boss.DamagePerHit,
            IsDefeated = boss.IsDefeated
        });
    }

    private async Task<UserProfile> GetOrCreateProfile()
    {
        var profile = await _db.UserProfiles.FirstOrDefaultAsync();
        if (profile is null)
        {
            profile = new UserProfile();
            _db.UserProfiles.Add(profile);
            await _db.SaveChangesAsync();
        }
        return profile;
    }

    private static void AddXp(UserProfile profile, int amount)
    {
        profile.Xp += amount;
        while (profile.Xp >= XpForLevel(profile.Level + 1))
            profile.Level++;
    }

    private void CheckBadges(UserProfile profile)
    {
        var badges = profile.Badges.Split(',', StringSplitOptions.RemoveEmptyEntries).ToHashSet();

        if (profile.GoalsCompleted >= 1 && badges.Add("First Step")) { }
        if (profile.Level >= 5 && badges.Add("Dedicated")) { }
        if (profile.PetLevel >= 3 && badges.Add("Pet Parent")) { }
        if (profile.DailyQuestsCompleted >= 5 && badges.Add("Quest Master")) { }

        var weekBosses = _db.WeeklyBosses.Count(b => b.IsDefeated);
        if (weekBosses >= 1 && badges.Add("Boss Slayer")) { }

        profile.Badges = string.Join(",", badges);
    }

    private static int GetWeekNumber() =>
        DateTimeOffset.UtcNow.DayOfYear / 7 + 1;

    private static string RandomBossName()
    {
        var names = new[] { "Procrastinator", "Lazy Giant", "Sloth Lord", "Distraction Demon", "Excuse Dragon", "Quit-Snake", "Snooze Beast" };
        return names[Random.Shared.Next(names.Length)];
    }

    private ProfileResponse ToProfileResponse(UserProfile p) => new()
    {
        Xp = p.Xp,
        Level = p.Level,
        XpForNext = XpForLevel(p.Level + 1),
        Badges = p.Badges.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
        PetType = p.PetType,
        PetLevel = p.PetLevel,
        GoalsCompleted = p.GoalsCompleted
    };
}

public record SetPetRequest(string PetType);

public class ProfileResponse
{
    public int Xp { get; set; }
    public int Level { get; set; }
    public int XpForNext { get; set; }
    public List<string> Badges { get; set; } = new();
    public string PetType { get; set; } = "";
    public int PetLevel { get; set; }
    public int GoalsCompleted { get; set; }
}

public class QuestResponse
{
    public int Id { get; set; }
    public string Description { get; set; } = "";
    public int XpReward { get; set; }
    public bool IsCompleted { get; set; }
}

public class BossResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int Hp { get; set; }
    public int MaxHp { get; set; }
    public int DamagePerHit { get; set; }
    public bool IsDefeated { get; set; }
}
