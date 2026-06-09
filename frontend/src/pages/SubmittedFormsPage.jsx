import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/forms.css";

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

  // ================== UI ==================
  return (
    <div className="container">

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

        /* FEEDBACK LIST */
        feedbacks.map((f) => (
          <div
            className="card"
            key={f.id}
          >

            {/* FORM TITLE */}
            <h3 className="form-title">
              {f.formTitle}
            </h3>

            {/* USER INFO */}
            <div className="user-info">
              <p>
                <b>Name:</b>{" "}
                {f.name}
              </p>
              <p>
                <b>Email:</b>{" "}
                {f.email}
              </p>
              <p>
                <b>Designation:</b>{" "}
                {f.designation}
              </p>

            </div>

            {/* ANSWERS */}
            <div className="answers-section">
              {f.answers &&
                f.answers.map(
                  (a, index) => (
                    <div
                      className="answer-box"
                      key={index}
                    >
                      <p>
                        <b>
                          Question:
                        </b>{" "}
                        {a.question}
                      </p>
                      <p>
                        <b>
                          Answer:
                        </b>{" "}
                        {a.answer}
                      </p>
                    </div>
                  )
                )}
            </div>

            {/* FINAL NOTE */}
            <div className="final-note">
              <p>
                <b>
                  Final Note:
                </b>{" "}
                {f.finalNote ||
                  "No final note"}
              </p>
            </div>
          </div>
        ))
      )}

    </div>
  );
}