
namespace Authservice.Models;
public class Answer
{
   public Guid Id { get; set; }
   public Guid QuestionId { get; set; }
   public Question Question { get; set; }
   public string Response { get; set; }
   public Guid FeedbackId { get; set; }
   public Feedback Feedback { get; set; }
   public string? MetadataJson {get; set;}
   public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
