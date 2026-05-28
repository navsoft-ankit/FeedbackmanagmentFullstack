using System;
using System.Collections.Generic;

namespace Authservice.Models
{
    public class FeedbackForm
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<Question> Questions { get; set; } = new();
    }
}