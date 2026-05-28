namespace Authservice.DTOs.Form;

public class SubmitFeedbackDTO
{
    public Guid FormId { get; set; }
    public List<AnswerDTO> Answers { get; set; }

    public string Name { get; set; }
    public string Email { get; set; }
    public string Designation { get; set; }
    public string FinalNote { get; set; }
    // public string Title { get; set; }
    
}