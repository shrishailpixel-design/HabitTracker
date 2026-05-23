using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Api.Data;
using Project.Api.Models;

namespace Project.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HabitGoalsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public HabitGoalsController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpGet]
    public async Task<ActionResult<List<GoalResponse>>> GetAll()
    {
        var goals = await _db.HabitGoals
            .Where(g => g.IsActive)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();

        return Ok(goals.Select(ToResponse).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GoalResponse>> Get(int id)
    {
        var goal = await _db.HabitGoals.FindAsync(id);
        if (goal is null) return NotFound();
        return Ok(ToResponse(goal));
    }

    [HttpPost]
    public async Task<ActionResult<GoalResponse>> Create(CreateGoalRequest request)
    {
        var goal = new HabitGoal
        {
            Title = request.Title,
            GoalDurationHours = request.GoalDurationHours,
            StartTime = DateTime.UtcNow,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _db.HabitGoals.Add(goal);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = goal.Id }, ToResponse(goal));
    }

    [HttpPost("{id}/delete")]
    public async Task<IActionResult> Delete(int id, [FromBody] DeleteRequest request)
    {
        var storedPassword = _config.GetValue<string>("DeletePassword") ?? "admin123";

        if (request.Password != storedPassword)
            return StatusCode(403, new { error = "Incorrect password" });

        var goal = await _db.HabitGoals.FindAsync(id);
        if (goal is null) return NotFound();

        goal.IsActive = false;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static GoalResponse ToResponse(HabitGoal goal)
    {
        var elapsed = DateTime.UtcNow - goal.StartTime;
        var remaining = TimeSpan.FromHours(goal.GoalDurationHours) - elapsed;

        if (remaining < TimeSpan.Zero)
            remaining = TimeSpan.Zero;

        return new GoalResponse
        {
            Id = goal.Id,
            Title = goal.Title,
            GoalDurationHours = goal.GoalDurationHours,
            StartTime = goal.StartTime,
            Elapsed = elapsed,
            Remaining = remaining,
            IsCompleted = remaining <= TimeSpan.Zero,
            IsActive = goal.IsActive,
            CreatedAt = goal.CreatedAt
        };
    }
}

public record CreateGoalRequest(string Title, double GoalDurationHours);

public record DeleteRequest(string Password);

public class GoalResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public double GoalDurationHours { get; set; }
    public DateTime StartTime { get; set; }
    public TimeSpan Elapsed { get; set; }
    public TimeSpan Remaining { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
