import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import api from "../api/axios";

import "../styles/forms.css";

export default function FeedbackPage() {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const role =
    localStorage.getItem("role");

  const [form, setForm] =
    useState(null);

  const [answers, setAnswers] =
    useState([]);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [designation, setDesignation] =
    useState("");

  const [finalNote, setFinalNote] =
    useState("");

  const [feedbacks, setFeedbacks] =
    useState([]);

  // =========================
  // LOAD
  // =========================

  useEffect(() => {

    fetchForm();

    if (role === "Admin") {

      fetchFeedbacks();
    }

  }, [id]);

  // =========================
  // GET FORM
  // =========================

  const fetchForm = async () => {

    try {

      const res =
        await api.get(
          `/forms/${id}`
        );

      setForm(res.data);

      setAnswers(

        res.data.questions.map((q) => ({

          questionId: q.id,

          response: ""

        }))
      );

    } catch (err) {

      console.log(err);
    }
  };

  // =========================
  // GET FEEDBACKS
  // =========================

  const fetchFeedbacks = async () => {

    try {

      const res =
        await api.get(
          `/feedback/forms/${id}`
        );

      setFeedbacks(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  // =========================
  // DELETE FEEDBACK
  // =========================

  const deleteFeedback =
    async (feedbackId) => {

      try {

        await api.delete(
          `/feedback/${feedbackId}`
        );

        fetchFeedbacks();

      } catch (err) {

        console.log(err);
      }
    };

  // =========================
  // UPDATE ANSWER
  // =========================

  const updateAnswer = (
    index,
    value
  ) => {

    const updated =
      [...answers];

    updated[index].response =
      value;

    setAnswers(updated);
  };

  // =========================
  // SUBMIT FEEDBACK
  // =========================

  const submitFeedback =
    async () => {

      try {

        await api.post(
          "/feedback/submit",
          {
            formId: id,

            name,

            email,

            designation,

            finalNote,

            answers
          }
        );

        // SUCCESS
        navigate("/dashboard");

      } catch (err) {

        console.log(err);

        // ALREADY SUBMITTED
        if (
          err.response?.data ===
          "Feedback already submitted"
        ) {

          navigate("/dashboard");

          return;
        }

        // OTHER ERROR
        alert(
          err.response?.data ||
          "Submit Failed"
        );
      }
    };

  // =========================
  // LOADING
  // =========================

  if (!form)
    return <h3>Loading...</h3>;

  return (

    <div className="user-feedback-page">

      {/* ================= USER ================= */}

      {role !== "Admin" && (

        <div className="feedback-container">

          {/* HEADER */}

          <div className="feedback-header">

            <h1>
              {form.title}
            </h1>

            <p>
              {form.description}
            </p>

          </div>

          {/* FORM */}

          <div className="feedback-form">

            {/* BASIC INFO */}

            <div className="feedback-section">

              <h3>
                Basic Information
              </h3>

              <input
                className="feedback-input"
                placeholder="Your Name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
              />

              <input
                className="feedback-input"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

              <input
                className="feedback-input"
                placeholder="Designation"
                value={designation}
                onChange={(e) =>
                  setDesignation(
                    e.target.value
                  )
                }
              />

            </div>

            {/* QUESTIONS */}

            {form.questions.map((q, i) => (

              <div
                className="feedback-section"
                key={q.id}
              >

                <div className="question-block">

                  <label>
                    {q.text}
                  </label>

                  {/* TEXT */}

                  {q.type === "Text" && (

                    <input
                      type="text"
                      className="feedback-input"
                      placeholder="Enter answer"
                      onChange={(e) =>
                        updateAnswer(
                          i,
                          e.target.value
                        )
                      }
                    />

                  )}

                  {/* DROPDOWN */}

                  {q.type === "Dropdown" && (

                    <select
                      className="feedback-select"
                      onChange={(e) =>
                        updateAnswer(
                          i,
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select Option
                      </option>

                      {q.options?.map(
                        (opt, idx) => (

                          <option
                            key={idx}
                            value={opt}
                          >
                            {opt}
                          </option>

                        )
                      )}

                    </select>

                  )}

{/* MCQ */}
{q.type === "MCQ" && (
  <div className="mcq-options">
    {q.options?.map((opt, idx) => (
      <label
        key={idx}
        className="mcq-option"
        htmlFor={`${q.id}-${idx}`}
      >
        <input
          id={`${q.id}-${idx}`}
          type="radio"
          name={q.id}
          value={opt}
          onChange={(e) =>
            updateAnswer(i, e.target.value)
          }
        />

        <span className="mcq-text">{opt}</span>
      </label>
    ))}
  </div>
)}             </div>

              </div>

            ))}

            {/* FINAL NOTE */}

            <div className="feedback-section">

              <h3>
                Additional Feedback
              </h3>

              <textarea
                className="feedback-textarea"
                placeholder="Final Note"
                value={finalNote}
                onChange={(e) =>
                  setFinalNote(
                    e.target.value
                  )
                }
              />

            </div>

            {/* BUTTON */}

            <button
              className="feedback-submit"
              onClick={submitFeedback}
            >
              Submit Feedback
            </button>

          </div>

        </div>
      )}

      {/* ================= ADMIN ================= */}

      {role === "Admin" && (

        <div className="feedback-container">

          <div className="feedback-header">

            <h1>
              Submitted Feedbacks
            </h1>

            <p>
              All submitted responses
            </p>

          </div>

          <div className="feedback-grid">

            {feedbacks.length === 0 && (
              <p>No feedback yet</p>
            )}

            {feedbacks.map((fb) => (

              <div
                key={fb.id}
                className="feedback-card"
              >

                <div className="user-top">

                  <div className="avatar">

                    {fb.name?.charAt(0)}

                  </div>

                  <div>

                    <h3>
                      {fb.name}
                    </h3>

                    <p>
                      {fb.email}
                    </p>

                  </div>

                </div>

                <div className="feedback-info">

                  <div className="info-row">

                    Designation:
                    {fb.designation}

                  </div>

                </div>

                <div className="answers-box">

                  {fb.answers?.map(
                    (a, i) => (

                      <div
                        key={i}
                        className="answer-item"
                      >

                        <h4>
                          Question :
                          {a.question}
                        </h4>

                        <p>
                          {a.answer}
                        </p>

                      </div>

                    )
                  )}

                </div>

                <div className="final-note">

                  <h4>
                    Final Note
                  </h4>

                  <p>
                    {fb.finalNote}
                  </p>

                </div>

                {/* DELETE BUTTON */}

                <button
                  className="delete-feedback-btn"
                  onClick={() =>
                    deleteFeedback(
                      fb.id
                    )
                  }
                >
                  Delete Feedback
                </button>

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
}