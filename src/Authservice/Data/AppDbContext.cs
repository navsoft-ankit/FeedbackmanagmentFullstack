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

    // FORM -> QUESTIONS

    modelBuilder.Entity<Question>()
        .HasOne(q => q.FeedbackForm)
        .WithMany(f => f.Questions)
        .HasForeignKey(q => q.FeedbackFormId)
        .OnDelete(DeleteBehavior.Cascade);

    // QUESTION -> OPTIONS

    modelBuilder.Entity<Option>()
        .HasOne(o => o.Question)
        .WithMany(q => q.Options)
        .HasForeignKey(o => o.QuestionId)
        .OnDelete(DeleteBehavior.Cascade);

    // FEEDBACK -> ANSWERS

    modelBuilder.Entity<Answer>()
        .HasOne(a => a.Feedback)
        .WithMany(f => f.Answers)
        .HasForeignKey(a => a.FeedbackId)
        .OnDelete(DeleteBehavior.Cascade);

    // FORM -> FEEDBACKS

    // KEEP NO ACTION HERE
    // TO AVOID MULTIPLE CASCADE PATHS

    modelBuilder.Entity<Feedback>()
        .HasOne(f => f.Form)
        .WithMany(fm => fm.Feedbacks)
        .HasForeignKey(f => f.FormId)
        .OnDelete(DeleteBehavior.NoAction);
}
}