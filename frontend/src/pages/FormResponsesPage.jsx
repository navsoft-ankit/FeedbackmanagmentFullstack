import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Trash2 } from "lucide-react";
import "../styles/forms.css";

export default function FormResponsesPage() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetchData();
  }, [formId]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/feedback/forms/${formId}`);
      setResponses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE FUNCTION =================
  const deleteFeedback = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this response?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/feedback/${id}`);
      alert("Deleted successfully");
      fetchData(); // refresh list
    } catch (err) {
      console.log(err);
      alert("Error deleting response");
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
            <p><b>Name:</b> {r.name}</p>
            <p><b>Email:</b> {r.email}</p>
            <p><b>Designation:</b> {r.designation}</p>
            <p><b>Note:</b> {r.finalNote}</p>

            <h4>Answers:</h4>
            {r.answers.map((a, i) => (
              <p key={i}>
                {a.question}: {a.answer}
              </p>
            ))}

            <button
              className="delete-btn"
              style={{ marginTop: "10px" }}
              onClick={() => deleteFeedback(r.id)}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}