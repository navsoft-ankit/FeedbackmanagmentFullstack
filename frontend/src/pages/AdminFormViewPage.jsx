import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";
import "../styles/forms.css";

export default function AdminFormViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.get(`/forms/${id}`);
        setForm(res.data);
      } catch (err) {
        console.log(err);
        alert("Failed to load form");
      }
    };
    fetchForm();
  }, [id]);

  if (!form) return <h3 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h3>;

  return (
    <div className="admin-form-view">

      {/* Header */}
      <div className="admin-view-header">

        {/* <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button> */}

        <div className="form-title-section">

          <span className="page-badge">
            FORM PREVIEW
          </span>

          <h1>{form.title}</h1>

          <p>
            {form.description || "No description provided"}
          </p>

        </div>

      </div>

      {/* Stats */}
      <div className="form-preview-stats">

        <div className="preview-stat-card">
          <span>Total Questions</span>
          <h3>{form.questions.length}</h3>
        </div>

        <div className="preview-stat-card">
          <span>Form Status</span>
          <h3>Active</h3>
        </div>

        <div className="preview-stat-card">
          <span>Type</span>
          <h3>Feedback Form</h3>
        </div>

      </div>

      {/* Questions */}
      <div className="questions-wrapper">

        {form.questions.map((q, index) => (

          <div
            key={q.id}
            className="preview-question-card"
          >

            <div className="question-top">

              <div className="question-number">
                Q{index + 1}
              </div>

              <div className="question-type">
                {q.type}
              </div>

            </div>

            <h3>{q.text}</h3>

            {(q.type === "MCQ" ||
              q.type === "Dropdown") &&
              q.options?.length > 0 && (

                <div className="preview-options">

                  {q.options.map((opt, idx) => (

                    <div
                      key={idx}
                      className="preview-option"
                    >
                      {opt}
                    </div>

                  ))}

                </div>

              )}

            {q.type === "Text" && (
              <input
                type="text"
                disabled
                placeholder="User answer will appear here..."
                className="preview-input"
              />
            )}

          </div>

        ))}

      </div>

    </div>
  );
}