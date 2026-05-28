using Authservice.Models;
public class Option
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public Question Question { get; set; }   // ADD THIS
    public string Value { get; set; }
}