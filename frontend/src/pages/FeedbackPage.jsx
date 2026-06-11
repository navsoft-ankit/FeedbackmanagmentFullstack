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

  // ================= LOAD =================
  useEffect(() => {

    fetchForm();

    if (role === "Admin") {

      fetchFeedbacks();
    }

  }, [id]);

  // ================= GET FORM =================
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

  // ================= GET FEEDBACKS =================
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

  // ================= DELETE FEEDBACK =================
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

  // ================= UPDATE ANSWER =================
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

  // ================= SUBMIT FEEDBACK =================
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

        // ================= SUCCESS =================
        navigate("/dashboard");

      } catch (err) {

        console.log(err);

        // ================= ALREADY SUBMITTED =================
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

  // ================= LOADING =================
  if (!form)
    return <h3>Loading...</h3>;

  return (
  <div className="user-feedback-page">

    {/* ================= USER VIEW ================= */}
    {role !== "Admin" && (

      <div className="feedback-container">

        {/* HERO */}

        <div className="feedback-hero">

          <span className="page-tag">
            FEEDBACK FORM
          </span>

          <h1>
            {form.title}
          </h1>

          <p>
            {form.description}
          </p>

        </div>

        {/* BASIC INFO */}

        <div className="modern-feedback-card">

          <div className="section-title">
            Basic Information
          </div>

          <input
            className="feedback-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            className="feedback-input"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
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
            key={q.id}
            className="question-card-modern"
          >

            <div className="question-number">
              Question {i + 1}
            </div>

            <label>
              {q.text}
            </label>

            {/* TEXT */}

            {q.type === "Text" && (

              <input
                type="text"
                className="feedback-input"
                placeholder="Enter your answer"
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

              <div className="modern-mcq-grid">

                {q.options?.map(
                  (opt, idx) => (

                    <label
                      key={idx}
                      className="modern-option"
                    >

                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        onChange={(e) =>
                          updateAnswer(
                            i,
                            e.target.value
                          )
                        }
                      />

                      <span>
                        {opt}
                      </span>

                    </label>

                  )
                )}

              </div>

            )}

          </div>

        ))}

        {/* FINAL NOTE */}

        <div className="modern-feedback-card">

          <div className="section-title">
            Additional Feedback
          </div>

          <textarea
            className="feedback-textarea"
            placeholder="Share any additional thoughts..."
            value={finalNote}
            onChange={(e) =>
              setFinalNote(
                e.target.value
              )
            }
          />

        </div>

        {/* SUBMIT */}

        <button
          className="modern-submit-btn"
          onClick={submitFeedback}
        >
          Submit Feedback
        </button>

      </div>

    )}

    {/* ================= ADMIN VIEW ================= */}

    {role === "Admin" && (

      <div className="feedback-container">

        {/* HEADER */}

        <div className="feedback-hero">

          <span className="page-tag">
            RESPONSE CENTER
          </span>

          <h1>
            Submitted Feedbacks
          </h1>

          <p>
            Monitor, review and manage all
            submitted responses.
          </p>

        </div>

        {/* STATS */}

        <div className="responses-stats">

          <div className="stat-card">
            <span>Total Responses</span>
            <h3>
              {feedbacks.length}
            </h3>
          </div>

          <div className="stat-card">
            <span>Form</span>
            <h3>
              {form.title}
            </h3>
          </div>

          <div className="stat-card">
            <span>Questions</span>
            <h3>
              {form.questions?.length}
            </h3>
          </div>

          <div className="stat-card">
            <span>Status</span>
            <h3>Live</h3>
          </div>

        </div>

        {/* FEEDBACKS */}

        <div className="feedback-grid">

          {feedbacks.length === 0 && (

            <div className="modern-feedback-card">

              <h3>
                No Feedback Yet
              </h3>

              <p>
                Responses will appear
                here once users submit
                feedback.
              </p>

            </div>

          )}

          {feedbacks.map((fb) => (

            <div
              key={fb.id}
              className="feedback-card"
            >

              {/* USER */}

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

              {/* INFO */}

              <div className="feedback-info">

                <div>
                  <span>
                    Designation
                  </span>

                  <strong>
                    {fb.designation}
                  </strong>
                </div>

              </div>

              {/* ANSWERS */}

              <div className="answers-box">

                <h3>
                  Responses
                </h3>

                {fb.answers?.map(
                  (a, i) => (

                    <div
                      key={i}
                      className="answer-item"
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

              {/* NOTE */}

              <div className="final-note">

                <h4>
                  Final Feedback
                </h4>

                <p>
                  {fb.finalNote ||
                    "No additional feedback"}
                </p>

              </div>

              {/* DELETE */}

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