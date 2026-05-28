using System;
using System.Collections.Generic;

namespace Authservice.Models;

public class Question
{
    public Guid Id { get; set; }

    // RELATION WITH FEEDBACK FORM
    public Guid FeedbackFormId { get; set; }

    public FeedbackForm FeedbackForm { get; set; }

    public string Text { get; set; }

    public QuestionType Type { get; set; }

    public List<Option> Options { get; set; } = new();

    public string? Note { get; set; }

    public string? MetadataJson { get; set; }
}