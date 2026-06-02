import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Trash2, Eye } from "lucide-react";
import "../styles/forms.css";

export default function ResponsesPage() {
  const [responses, setResponses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const res = await api.get("/feedback/all");
      setResponses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 DELETE FUNCTION
  const deleteFeedback = async (id) => {
    try {
      await api.delete(`/feedback/${id}`);
      alert("Deleted successfully");
      fetchResponses();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="forms-page">
      <div className="forms-header">
        <h1>All Responses</h1>
      </div>

      <div className="forms-grid">
        {responses.map((r) => (
          <div className="form-card" key={r.id}>
            <h3>{r.name}</h3>
            <p>{r.email}</p>
            <p>{r.formTitle}</p>

            {/* 🔥 BUTTON GROUP CENTER */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginTop: "15px",
              }}
            >
              {/* VIEW */}
              <button
                className="view-btn"
                onClick={() =>
                  navigate(`/admin-feedbacks/${r.formId}`)
                }
              >
                <Eye size={16} />
                View
              </button>

              {/* DELETE */}
              <button
                className="delete-btn"
                onClick={() => deleteFeedback(r.id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}