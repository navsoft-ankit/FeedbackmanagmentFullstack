import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/submittedForms.css";

export default function SubmittedFormsPage() {

  const [feedbacks, setFeedbacks] =
    useState([]);

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

      {/* PAGE TITLE */}
      <h2 className="page-title">

        Submitted Forms

      </h2>

      {/* LOADING */}
      {loading ? (
        <p className="empty-text">
          Loading...
        </p>
      ) : feedbacks.length === 0 ? (
        /* EMPTY */
        <div className="card">
          <p className="empty-text">
            No submitted forms found
          </p>

        </div>

      ) : (

        // ================= FEEDBACK LIST ================= //
        <div className="forms-grid">
          {feedbacks.map((f) => (
            <div className="card" key={f.id}>

              <h3 className="form-title">{f.formTitle}</h3>

              <div className="user-info">
                <span className="info-badge">Name: {f.name}</span>
                <span className="info-badge">Email: {f.email}</span>
                <span className="info-badge">Designation: {f.designation}</span>
              </div>

              <div className="answers-section">
                {f.answers?.map((a, index) => (
                  <div className="answer-box" key={index}>
                    <p><b>Question:</b> {a.question}</p>
                    <p><b>Answer:</b> {a.answer}</p>
                  </div>
                ))}
              </div>

              <div className="final-note">
                <p>
                  <b>Final Note:</b> {f.finalNote || "No final note"}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}