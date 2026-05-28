namespace Authservice.DTOs.Form;

public class AnswerDTO
{
    public Guid QuestionId { get; set; }
    public Guid? OptionId { get; set; }
    public string? TextValue { get; set; }
    public string Response { get; set; }
}