using Microsoft.EntityFrameworkCore;
using Authservice.Models;

namespace Authservice.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Option> Options { get; set; }
    public DbSet<FeedbackForm> FeedbackForms { get; set; }
    public DbSet<Feedback> Feedbacks { get; set; }
    public DbSet<Answer> Answers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Feedback>()
            .HasOne(f => f.Form)
            .WithMany(fm => fm.Feedbacks)
            .HasForeignKey(f => f.FormId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}