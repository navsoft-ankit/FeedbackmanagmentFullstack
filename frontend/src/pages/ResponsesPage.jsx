import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Eye, Trash2 } from "lucide-react";
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

  // GROUP BY FORM
  const grouped = responses.reduce((acc, item) => {
    if (!acc[item.formId]) {
      acc[item.formId] = {
        formId: item.formId,
        formTitle: item.formTitle,
        count: 0,
      };
    }
    acc[item.formId].count += 1;
    return acc;
  }, {});

  // DELETE ALL RESPONSES FOR A FORM
  const deleteAllResponses = async (formId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete ALL responses for this form?"
    );
    if (!confirmDelete) return;

    try {
      
      // Delete each response individually (since backend only supports single delete)
      const formResponses = responses.filter(r => r.formId === formId);
      for (let r of formResponses) {
        await api.delete(`/feedback/${r.id}`);
      }
      alert("All responses deleted successfully");
      fetchResponses(); // refresh list
    } catch (err) {
      console.log(err);
      alert("Error deleting responses");
    }
  };

  return (
    <div className="forms-page">
      <div className="forms-header">
        <h1>All Forms</h1>
      </div>

      <div className="forms-grid">
        {Object.values(grouped).map((form) => (
          <div className="form-card" key={form.formId}>
            <h3>{form.formTitle}</h3>
            <p>Total Responses: {form.count}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                className="view-btn"
                onClick={() => navigate(`/admin-feedbacks/${form.formId}`)}
              >
                <Eye size={16} /> View Responses
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteAllResponses(form.formId)}
              >
                <Trash2 size={16} /> Delete All Responses
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}