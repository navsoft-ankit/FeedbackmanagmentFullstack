using Authservice.DTOs.Form;
using Authservice.Models;
public class CreateFormDTO
{
    public string Title { get; set; }
    public string Description { get; set; }
    public List<CreateQuestionDTO> Questions { get; set; }
}