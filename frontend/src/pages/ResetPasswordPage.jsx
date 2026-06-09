import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

import { Mail, ArrowRight } from "lucide-react";
import "../styles/auth.css";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const emailFromUrl = params.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5091/api/auth/forgot-password",
        { email }
      );

      setMessage("Reset link sent to your email");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.log(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="overlay-content">
            <h1 className="brand-title">Voxify</h1>
            <h2>Feedback Management System</h2>

            <p>
              Enter your email and we’ll send you a password reset link.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <form className="auth-form" onSubmit={handleReset}>

            <h1>Reset Password</h1>
            <p>We will send a reset link</p>

            {/* EMAIL ONLY */}
            <div className="input-box">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              {loading ? "Sending..." : "Send Reset Link"}
              <ArrowRight size={18} />
            </button>

            {message && (
              <p style={{ marginTop: "10px", color: "#7c3aed" }}>
                {message}
              </p>
            )}

          </form>
        </div>

      </div>
    </div>
  );
}