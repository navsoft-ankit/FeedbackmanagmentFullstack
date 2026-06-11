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
  <div className="responses-dashboard">

    {/* HEADER */}

    <div className="dashboard-header">
      <div>
        <span className="page-tag">RESPONSE MANAGEMENT</span>

        <h1>Feedback Responses</h1>

        <p>
          Monitor and manage all submitted feedback responses from your forms.
        </p>
      </div>
    </div>

    {/* STATS */}

    <div className="dashboard-stats">

      <div className="analytics-card">
        <span>Total Forms</span>
        <h2>{Object.values(grouped).length}</h2>
      </div>

      <div className="analytics-card">
        <span>Total Responses</span>
        <h2>{responses.length}</h2>
      </div>

      <div className="analytics-card">
        <span>Status</span>
        <h2>Active</h2>
      </div>

    </div>

    {/* EMPTY STATE */}

    {Object.values(grouped).length === 0 ? (

      <div className="empty-state">

        <h2>No Responses Found</h2>

        <p>
          Submitted feedback responses will appear here once users start
          submitting forms.
        </p>

      </div>

    ) : (

      <div className="responses-table-wrapper">

        <div className="table-header">

          <div>
            <h2>All Form Responses</h2>
            <p>
              Manage responses collected from all your feedback forms.
            </p>
          </div>

          <div className="table-count">
            {Object.values(grouped).length} Forms
          </div>

        </div>

        <div className="table-container">

          <table className="responses-table">

            <thead>

              <tr>
                <th>Form</th>
                <th>Form ID</th>
                <th>Responses</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {Object.values(grouped).map((form) => (

                <tr key={form.formId}>

                  <td>

                    <div className="form-cell">

                      <div className="form-avatar">
                        {form.formTitle?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>

                        <h4>{form.formTitle}</h4>

                        <p>Feedback Form</p>

                      </div>

                    </div>

                  </td>

                  <td>
                    #{form.formId}
                  </td>

                  <td>

                    <span className="response-pill">
                      {form.count}
                    </span>

                  </td>

                  <td>

                    <span className="status-pill">
                      Active
                    </span>

                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(`/admin-feedbacks/${form.formId}`)
                        }
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteAllResponses(form.formId)
                        }
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    )}

  </div>
);
}