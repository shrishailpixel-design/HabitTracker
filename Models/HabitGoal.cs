using System.ComponentModel.DataAnnotations;

namespace Project.Api.Models;

public class HabitGoal
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public double GoalDurationHours { get; set; }

    public DateTime StartTime { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
