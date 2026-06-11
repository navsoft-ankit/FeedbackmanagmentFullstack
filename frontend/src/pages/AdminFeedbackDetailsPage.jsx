import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  User,
  Mail,
  Briefcase,
  MessageSquare
} from "lucide-react";

import api from "../api/axios";
import "../styles/forms.css";

export default function AdminFeedbacksPage() {

  const { formId } =
    useParams();

  const [feedbacks, setFeedbacks] =
    useState([]);

  // ================= FETCH FEEDBACKS =================

  useEffect(() => {

    fetchFeedbacks();

  }, []);

  const fetchFeedbacks =
    async () => {
      try {
        const res =
          await api.get(
            `/feedback/forms/${formId}`
          );
        setFeedbacks(res.data);
      } catch (err) {
        console.log(err);
      }
    };

 return (
  <div className="admin-feedback-page">

    <div className="dashboard-header">

      <div>
        <span className="page-tag">
          FEEDBACK RESPONSES
        </span>

        <h1>User Responses</h1>

        <p>
          Review all submitted responses for this form.
        </p>
      </div>

      <div className="response-counter">
        {feedbacks.length} Responses
      </div>

    </div>

    {feedbacks.length === 0 ? (

      <div className="empty-state">

        <MessageSquare size={70} />

        <h2>No Responses Found</h2>

        <p>
          Responses submitted by users will appear here.
        </p>

      </div>

    ) : (

      <div className="responses-list">

        {feedbacks.map((f, index) => (

          <div
            className="response-panel"
            key={f.id}
          >

            {/* USER HEADER */}

            <div className="response-top">

              <div className="response-user">

                <div className="user-avatar">
                  {f.name?.charAt(0)?.toUpperCase()}
                </div>

                <div>

                  <h3>{f.name}</h3>

                  <p>{f.email}</p>

                </div>

              </div>

              <div className="response-number">
                #{index + 1}
              </div>

            </div>

            {/* DESIGNATION */}

            <div className="response-meta">

              <div className="meta-box">

                <span>Designation</span>

                <h4>
                  {f.designation || "Not Provided"}
                </h4>

              </div>

            </div>

            {/* ANSWERS TABLE */}

            <div className="answers-section">

              <h3>Responses</h3>

              <div className="answers-table-wrapper">

                <table className="answers-table">

                  <thead>

                    <tr>
                      <th>Question</th>
                      <th>Answer</th>
                    </tr>

                  </thead>

                  <tbody>

                    {(f.answers || []).map((a, i) => (

                      <tr key={i}>

                        <td className="question-cell">
                          {a.question}
                        </td>

                        <td className="answer-cell">
                          {a.answer}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            {/* FINAL NOTE */}

            {f.finalNote && (

              <div className="final-note">

                <h4>Final Note</h4>

                <p>{f.finalNote}</p>

              </div>

            )}

          </div>

        ))}

      </div>

    )}

  </div>
);
}