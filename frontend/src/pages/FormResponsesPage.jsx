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
  <div className="responses-page">

    {/* HEADER */}

    <div className="responses-header">

      <div>
        <span className="page-tag">
          RESPONSE MANAGEMENT
        </span>

        <h1>Feedback Responses</h1>

        <p>
          Review all submitted responses for this form.
        </p>
      </div>

    </div>

    {/* STATS */}

    <div className="responses-stats">

      <div className="stat-box">
        <span>Total Responses</span>
        <h2>{responses.length}</h2>
      </div>

      <div className="stat-box">
        <span>Questions</span>
        <h2>{responses[0]?.answers?.length || 0}</h2>
      </div>

      <div className="stat-box">
        <span>Status</span>
        <h2>Active</h2>
      </div>

    </div>

    {/* EMPTY */}

    {responses.length === 0 ? (

      <div className="empty-state">
        <h2>No Responses Found</h2>
        <p>
          Responses will appear here once users submit feedback.
        </p>
      </div>

    ) : (

      <div className="responses-table-card">

        <table className="responses-table">

          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Answers</th>
              <th>Final Note</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {responses.map((response) => (

              <tr key={response.id}>

                <td>

                  <div className="user-cell">

                    <div className="avatar-circle">
                      {response.name?.charAt(0)}
                    </div>

                    <span>
                      {response.name}
                    </span>

                  </div>

                </td>

                <td>
                  {response.email}
                </td>

                <td>
                  {response.designation}
                </td>

                <td>

                  <div className="answers-preview">

                    {response.answers?.map(
                      (answer, index) => (

                        <div
                          key={index}
                          className="answer-chip"
                        >
                          <strong>
                            {answer.question}
                          </strong>

                          <span>
                            {answer.answer}
                          </span>
                        </div>

                      )
                    )}

                  </div>

                </td>

                <td>

                  <div className="note-preview">
                    {response.finalNote ||
                      "No feedback"}
                  </div>

                </td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteFeedback(
                        response.id
                      )
                    }
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    )}

  </div>
);
}