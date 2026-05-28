using Microsoft.EntityFrameworkCore;
using Authservice.Models;
using Authservice.Data;
using System.Reflection.Metadata;
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
    }