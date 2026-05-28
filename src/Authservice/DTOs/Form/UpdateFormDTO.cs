using Authservice.DTOs.Form;
public class UpdateFormDTO
{
    public Guid? Id{get; set;}
    public string Title { get; set; }
    public string Description { get; set; }
    public List<CreateQuestionDTO> Questions { get; set; }
    public string? Note { get; set; }
}