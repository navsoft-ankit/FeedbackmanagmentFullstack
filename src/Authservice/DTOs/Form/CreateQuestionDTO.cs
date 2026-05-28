using Authservice.Models;

namespace Authservice.DTOs.Form;

public class CreateQuestionDTO
{
    public Guid? Id { get; set; }
    public string Text { get; set; }
    public QuestionType Type { get; set; }
    public List<string>? Options { get; set; }

    public string? Note { get; set; }
    public string? MetadataJson {get; set;}
}