using Microsoft.EntityFrameworkCore;
using Project.Api.Models;

namespace Project.Api.Data;

public class AppDbContext : DbContext
{
    public DbSet<HabitGoal> HabitGoals => Set<HabitGoal>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<HabitGoal>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(200).IsRequired();
        });
    }
}
