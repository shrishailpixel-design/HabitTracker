using System.ComponentModel.DataAnnotations;

namespace Project.Api.Models;

public class UserProfile
{
    public int Id { get; set; }
    public int Xp { get; set; }
    public int Level { get; set; } = 1;
    public string Badges { get; set; } = "";
    public string PetType { get; set; } = "cat";
    public int PetLevel { get; set; } = 1;
    public DateTime? LastDailyDate { get; set; }
    public int DailyQuestsCompleted { get; set; }
    public int GoalsCompleted { get; set; }
}

public class DailyQuest
{
    public int Id { get; set; }
    public string Description { get; set; } = "";
    public int XpReward { get; set; }
    public bool IsCompleted { get; set; }
    public DateOnly Date { get; set; }
    public string QuestType { get; set; } = "";
}

public class WeeklyBoss
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int Hp { get; set; }
    public int MaxHp { get; set; }
    public int DamagePerHit { get; set; }
    public bool IsDefeated { get; set; }
    public int WeekNumber { get; set; }
}
