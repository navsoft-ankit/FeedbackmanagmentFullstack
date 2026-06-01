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

  // =========================
  // FETCH FEEDBACKS
  // =========================

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

      {/* HEADER */}

      <div className="forms-header">

        <h1>
          User Responses
        </h1>

        <p>
          Admin can view all
          submitted feedbacks.
        </p>

      </div>

      {/* EMPTY */}

      {feedbacks.length === 0 && (

        <div className="empty-box">

          <MessageSquare size={60} />

          <h2>
            No Feedback Found
          </h2>

        </div>
      )}

      {/* FEEDBACK GRID */}

      <div className="feedback-grid">

        {feedbacks.map((f) => (

          <div
            className="feedback-card"
            key={f.id}
          >

            {/* USER */}

            <div className="user-top">

              <div className="avatar">

                <User size={28} />

              </div>

              <div>

                <h3>
                  {f.name}
                </h3>

                <p>
                  User Response
                </p>

              </div>

            </div>

            {/* USER DETAILS */}

            <div className="feedback-info">

              <div className="info-row">

                <Mail size={18} />

                <span>
                  {f.email}
                </span>

              </div>

              <div className="info-row">

                <Briefcase size={18} />

                <span>
                  {f.designation}
                </span>

              </div>

            </div>

            {/* ANSWERS */}

            {/* ANSWERS */}

            <div className="answers-box">

              {(f.answers || []).map(
                (a, index) => (

                  <div
                    className="answer-item"
                    key={index}
                  >

                    <h4>
                      {a.question}
                    </h4>

                    <p>
                      {a.answer}
                    </p>

                  </div>
                )
              )}

            </div>

            {/* FINAL NOTE */}

            <div className="final-note">

              <h4>
                Final Note
              </h4>

              <p>
                {f.finalNote}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}