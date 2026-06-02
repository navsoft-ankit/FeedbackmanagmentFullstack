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
    <div className="form-page">
      {/* HEADER */}
      <div className="form-header">
        <button
          className="view-btn"
          onClick={() => navigate(-1)}
          style={{ marginBottom: "15px", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1>{form.title}</h1>
        <p>{form.description}</p>
      </div>

      {/* QUESTIONS */}
      <div className="form-grid">
        {form.questions.map((q) => (
          <div className="question-card" key={q.id}>
            
            {/* QUESTION TEXT (WHITE) */}
            <h3 style={{ color: "white" }}>{q.text}</h3>

            {/* QUESTION TYPE (WHITE) */}
            <p style={{ color: "white" }}>Type: {q.type}</p>

            {q.options?.length > 0 && (
              <div className="mcq-options">
                {q.options.map((opt, idx) => (
                  <div className="mcq-option" key={idx}>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}