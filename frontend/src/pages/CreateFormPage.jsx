import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/forms.css";

export default function CreateFormPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState([
    {
      text: "",
      type: "Text",
      options: []
    }
  ]);

  // =========================
  // ADD QUESTION
  // =========================
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "Text",
        options: []
      }
    ]);
  };

  // =========================
  // UPDATE QUESTION
  // =========================
  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // =========================
  // UPDATE OPTIONS
  // =========================
  const updateOptions = (index, value) => {
    const updated = [...questions];

    updated[index].options = value
      .split(",")
      .map((o) => o.trim())
      .filter((o) => o !== "");

    setQuestions(updated);
  };

  // =========================
  // SUBMIT FORM
  // =========================
  const submitForm = async () => {
    try {
      const payload = {
        title: title,
        description: description,
        questions: questions.map((q) => ({
          text: q.text,

          // 🔥 FIX ONLY HERE (ENUM MATCH BACKEND)
          type:
            q.type === "Text"
              ? 0
              : q.type === "MCQ"
                ? 1
                : 2,

          options:
            q.type === "Text"
              ? []
              : q.options
        }))
      };

      console.log("FINAL PAYLOAD:", payload);

      await api.post("/forms/create", payload);

      navigate("/dashboard");
    } catch (err) {
      console.log(err?.response?.data || err.message);

      alert(
        err?.response?.data?.message ||
        "Create Form Failed"
      );
    }
  };

  return (
    <div className="form-page">

      {/* HEADER */}
      <div className="form-header">

        <div>
          <h1>Create New Form</h1>

          <p>
            Create feedback forms and add questions easily.
          </p>
        </div>

        <button
          className="save-btn"
          onClick={submitForm}
        >
          Save Form
        </button>

      </div>

      {/* FORM DETAILS */}
      <div className="form-box">

        <h2>Form Details</h2>

        <div className="form-grid">

          <div>
            <label>Form Title</label>

            <input
              type="text"
              placeholder="Enter form title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          <div>
            <label>Description</label>

            <textarea
              placeholder="Enter form description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

        </div>
      </div>

      {/* QUESTIONS */}
      <div className="form-box">

        <div className="question-top">

          <h2>Questions</h2>

          <button
            className="add-btn"
            onClick={addQuestion}
          >
            + Add Question
          </button>

        </div>

        {questions.map((q, i) => (
          <div key={i} className="question-card">

            <div className="question-input">
              <label>Question</label>

              <input
                type="text"
                placeholder="Enter question"
                value={q.text}
                onChange={(e) =>
                  updateQuestion(
                    i,
                    "text",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="type-input">
              <label>Type</label>

              <select
                value={q.type}
                onChange={(e) =>
                  updateQuestion(
                    i,
                    "type",
                    e.target.value
                  )
                }
              >
                <option value="Text">Text</option>
                <option value="Dropdown">Dropdown</option>
                <option value="MCQ">MCQ</option>
              </select>
            </div>

            {(q.type === "Dropdown" ||
              q.type === "MCQ") && (
                <div className="option-input">
                  <label>Options</label>

                  <input
                    type="text"
                    placeholder="Option1, Option2"
                    onChange={(e) =>
                      updateOptions(
                        i,
                        e.target.value
                      )
                    }
                  />
                </div>
              )}

          </div>
        ))}

      </div>

    </div>
  );
}