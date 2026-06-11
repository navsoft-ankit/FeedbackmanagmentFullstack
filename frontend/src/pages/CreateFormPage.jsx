import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/forms.css";

export default function CreateFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { id: Date.now(), text: "", type: "Text", options: [], isNew: true }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= LOAD EXISTING FORM (EDIT MODE) =================
  useEffect(() => {
    if (isEdit) fetchForm();
  }, [id]);

  const fetchForm = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/forms/${id}`);
      const data = res.data;

      setTitle(data.title);
      setDescription(data.description);
      setQuestions(
        data.questions.map((q) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: Array.isArray(q.options) ? q.options : [],
          isNew: false
        }))
      );
    } catch (err) {
      console.log(err);
      setError("Failed to load form data");
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD / DELETE / UPDATE QUESTIONS =================
  const addQuestion = () =>
    setQuestions([
      ...questions,
      { id: Date.now(), text: "", type: "Text", options: [], isNew: true }
    ]);

  const deleteQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    if (field === "type" && value === "Text") updated[index].options = [];
    setQuestions(updated);
  };

  // ================= ADD / UPDATE / DELETE OPTIONS =================
  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const deleteOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  // ================= VALIDATE FORM =================
  const validateForm = () => {
    if (!title.trim()) {
      alert("Form title cannot be empty");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        alert(`Question ${i + 1} cannot be empty`);
        return false;
      }
      if ((q.type === "Dropdown" || q.type === "MCQ") && q.options.length < 2) {
        alert(`Question ${i + 1} must have at least 2 options`);
        return false;
      }
    }
    return true;
  };

  // ================= MAP STRING TO ENUM BACKEND =================
  const mapToEnum = (typeStr) => {
    switch (typeStr) {
      case "MCQ": return "MCQ";
      case "Dropdown": return "Dropdown";
      case "Text": return "Text";
      case "FinalFeedback": return "FinalFeedback";
      default: return "Text";
    }
  };

  // ================= SUBMIT FORM =================
  const submitForm = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const payload = {
        title: title?.trim(),
        description: description?.trim(),
        questions: questions.map((q) => {
          const questionPayload = {
            text: q.text?.trim(),
            type: mapToEnum(q.type),
            options: q.type === "Text"
              ? []
              : (q.options || []).filter((o) => o && o.trim() !== ""),
            note: "",
            metadataJson: "",
            isRequired: false
          };

          if (isEdit && !q.isNew) {
            questionPayload.id = q.id;
          }

          return questionPayload;
        }),
        note: ""
      };

      console.log("Submitting payload:", payload);

      if (isEdit) {
        await api.put(`/forms/${id}`, payload);
        alert("Form Updated Successfully");
      } else {
        await api.post("/forms/create", payload);
        alert("Form Created Successfully");
      }

      navigate("/forms");
    } catch (err) {
      console.log("API ERROR:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Error saving form");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="form-page">

      {/* HEADER */}
      <div className="form-header">
        <div>
          <span className="page-tag">
            FORM BUILDER
          </span>

          <h1>
            {isEdit
              ? "Edit Feedback Form"
              : "Create Feedback Form"}
          </h1>

          <p>
            Design professional feedback forms and collect
            responses effortlessly.
          </p>
        </div>

        <button
          className="publish-btn"
          onClick={submitForm}
        >
          {isEdit
            ? "Update Form"
            : "Publish Form"}
        </button>
      </div>

      {/* STATS */}
      <div className="form-stats">

        <div className="stat-card">
          <span>Total Questions</span>
          <h3>{questions.length}</h3>
        </div>

        <div className="stat-card">
          <span>MCQs</span>
          <h3>
            {
              questions.filter(
                (q) => q.type === "MCQ"
              ).length
            }
          </h3>
        </div>

        <div className="stat-card">
          <span>Dropdowns</span>
          <h3>
            {
              questions.filter(
                (q) => q.type === "Dropdown"
              ).length
            }
          </h3>
        </div>

        <div className="stat-card">
          <span>Text Fields</span>
          <h3>
            {
              questions.filter(
                (q) => q.type === "Text"
              ).length
            }
          </h3>
        </div>

      </div>

      {/* MAIN LAYOUT */}
      <div className="form-layout">

        {/* LEFT SIDE */}
        <div className="form-editor">

          {/* FORM DETAILS */}
          <div className="modern-card">

            <div className="card-header">
              <h2>Form Information</h2>
              <span>Basic Details</span>
            </div>

            <div className="form-group">
              <label>Form Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Employee Feedback Survey"
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Describe the purpose of this form..."
              />
            </div>

          </div>

          {/* QUESTIONS */}
          <div className="modern-card">

            <div className="question-header">

              <div>
                <h2>Questions</h2>
                <span>
                  Manage all questions
                </span>
              </div>

              <button
                className="add-question-btn"
                onClick={addQuestion}
              >
                + Add Question
              </button>

            </div>

            {questions.map((q, i) => (
              <div
                key={q.id}
                className="question-card"
              >

                <div className="question-card-top">

                  <div className="question-number">
                    Question {i + 1}
                  </div>

                  {questions.length > 1 && (
                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteQuestion(i)
                      }
                    >
                      Delete
                    </button>
                  )}

                </div>

                <div className="question-field">

                  <label>
                    Question Text
                  </label>

                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) =>
                      updateQuestion(
                        i,
                        "text",
                        e.target.value
                      )
                    }
                    placeholder="Enter your question..."
                  />

                </div>

                <div className="question-field">

                  <label>
                    Response Type
                  </label>

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
                    <option value="Text">
                      Text
                    </option>

                    <option value="Dropdown">
                      Dropdown
                    </option>

                    <option value="MCQ">
                      Multiple Choice
                    </option>

                    <option value="FinalFeedback">
                      Final Feedback
                    </option>
                  </select>

                </div>

                {(q.type === "MCQ" ||
                  q.type === "Dropdown") && (
                    <div className="option-section">

                      <div className="option-top">

                        <h4>Options</h4>

                        <button
                          type="button"
                          className="add-option-btn"
                          onClick={() =>
                            addOption(i)
                          }
                        >
                          + Add Option
                        </button>

                      </div>

                      {q.options.map(
                        (opt, optIndex) => (
                          <div
                            key={optIndex}
                            className="option-row"
                          >

                            <input
                              type="text"
                              value={opt}
                              placeholder={`Option ${optIndex + 1
                                }`}
                              onChange={(e) =>
                                updateOption(
                                  i,
                                  optIndex,
                                  e.target.value
                                )
                              }
                            />

                            <button
                              type="button"
                              className="delete-option-btn"
                              onClick={() =>
                                deleteOption(
                                  i,
                                  optIndex
                                )
                              }
                            >
                              ✕
                            </button>

                          </div>
                        )
                      )}

                    </div>
                  )}

              </div>
            ))}

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="preview-panel">

          <div className="preview-card">

            <h2>Live Preview</h2>

            <div className="preview-form">

              <h3>
                {title ||
                  "Untitled Form"}
              </h3>

              <p>
                {description ||
                  "Your form description will appear here"}
              </p>

              {questions.map(
                (q, index) => (
                  <div
                    key={q.id}
                    className="preview-question"
                  >

                    <label>
                      {index + 1}.{" "}
                      {q.text ||
                        "Untitled Question"}
                    </label>

                    {q.type ===
                      "Text" && (
                        <input
                          disabled
                          placeholder="Text answer"
                        />
                      )}

                    {q.type ===
                      "Dropdown" && (
                        <select disabled>
                          <option>
                            Select an option
                          </option>
                        </select>
                      )}

                    {q.type ===
                      "MCQ" && (
                        <div className="preview-options">

                          {q.options.map(
                            (
                              option,
                              idx
                            ) => (
                              <div
                                key={idx}
                              >
                                <input
                                  type="radio"
                                  disabled
                                />

                                <span>
                                  {option ||
                                    `Option ${idx +
                                    1
                                    }`}
                                </span>
                              </div>
                            )
                          )}

                        </div>
                      )}

                    {q.type ===
                      "FinalFeedback" && (
                        <textarea
                          disabled
                          placeholder="Write your feedback..."
                        />
                      )}

                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}