using Authservice.Models;
namespace Authservice.DTOs.Form;
public class AddQuestionDTO
{
    public string Text { get; set; }
    public QuestionType Type { get; set; }
    public List<string>? Options { get; set; }
}