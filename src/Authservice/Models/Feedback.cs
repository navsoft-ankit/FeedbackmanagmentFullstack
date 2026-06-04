namespace Authservice.Models;

public class Feedback
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid FormId { get; set; }
    public FeedbackForm Form { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; }

    public string Email { get; set; }   // 🔥 MUST USE FOR FILTERING

    public string Designation { get; set; }

    public List<Answer> Answers { get; set; } = new();

    public string FinalNote { get; set; }
            public DateTime CreatedAt { get; set; }

}