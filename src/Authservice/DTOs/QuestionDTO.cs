public class QuestionDTO
{
    public string Id { get; set; }
    public string Text { get; set; }
    public string Type { get; set; }
    public List<string> Options { get; set; }
    public string? Note { get; set; }
    public string? MetadataJson {get; set;}
}