import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/submittedForms.css";

export default function SubmittedFormsPage() {

  const [feedbacks, setFeedbacks] =
    useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const [loading, setLoading] =
    useState(true);

  // ================== FETCH SUBMITTED FORMS ==================
  useEffect(() => {

    fetchSubmittedForms();

  }, []);

  const fetchSubmittedForms =
    async () => {

      try {

        const res =
          await api.get(
            "/feedback/my-feedbacks"
          );

        console.log(
          "DATA:",
          res.data
        );

        if (
          Array.isArray(
            res.data
          )
        ) {
          setFeedbacks(
            res.data
          );
        } else {
          setFeedbacks([]);
        }
      } catch (err) {

        console.log(
          "ERROR:",
          err
        );
      } finally {

        setLoading(false);
      }
    };

  // ================= UI ==================
  return (
  <div className="submitted-page">

    <div className="dashboard-header">

      <div>
        <span className="page-tag">
          MY SUBMISSIONS
        </span>

        <h1>Submitted Forms</h1>

        <p>
          View all forms you have already submitted.
        </p>
      </div>

      <div className="response-counter">
        {feedbacks.length} Submitted
      </div>

    </div>

    {loading ? (

      <div className="empty-state">
        <h2>Loading...</h2>
      </div>

    ) : feedbacks.length === 0 ? (

      <div className="empty-state">
        <h2>No Submitted Forms</h2>
        <p>
          Forms you submit will appear here.
        </p>
      </div>

    ) : (

      <div className="submitted-table">

        <div className="table-header">

          <div>Form</div>
          <div>Name</div>
          <div>Designation</div>
          <div>Final Note</div>
          <div>Action</div>

        </div>

        {feedbacks.map((f) => (

          <div
            className="table-row"
            key={f.id}
          >

            <div>{f.formTitle}</div>

            <div>{f.name}</div>

            <div>{f.designation}</div>

            <div>
              {f.finalNote || "-"}
            </div>

            <div>

              <button
                className="view-btn"
                onClick={() =>
                  setSelectedFeedback(f)
                }
              >
                View
              </button>

            </div>

          </div>

        ))}

      </div>

    )}

    {selectedFeedback && (

      <div
        className="modal-overlay"
        onClick={() =>
          setSelectedFeedback(null)
        }
      >

        <div
          className="modal-content"
          onClick={(e) =>
            e.stopPropagation()
          }
        >

          <div className="modal-header">

            <h2>
              {selectedFeedback.formTitle}
            </h2>

            <button
              className="close-btn"
              onClick={() =>
                setSelectedFeedback(null)
              }
            >
              ✕
            </button>

          </div>

          <div className="answers-table-wrapper">

            <table className="answers-table">

              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                </tr>
              </thead>

              <tbody>

                {(selectedFeedback.answers || []).map(
                  (a, i) => (

                    <tr key={i}>
                      <td>{a.question}</td>
                      <td>{a.answer}</td>
                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

          <div className="final-note">

            <h4>Final Note</h4>

            <p>
              {selectedFeedback.finalNote ||
                "No final note"}
            </p>

          </div>

        </div>

      </div>

    )}

  </div>
);
}