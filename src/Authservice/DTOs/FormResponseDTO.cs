public class FormResponseDTO
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public List<QuestionDTO> Questions { get; set; }
    public string? Note { get; set; }
}