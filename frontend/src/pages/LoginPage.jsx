import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";

import "../styles/auth.css";

export default function LoginPage() {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // LOGIN

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5091/api/auth/login",
        { email, password },
        { headers: { "X-Api-Key": "mvc-api-secret-key-2026" } }
      );
      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("createdAt", response.data.createdAt);

      navigate("/dashboard");

    } catch (error) {
      console.log(error);
      alert("Invalid Email or Password");
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5091/api/auth/register",
        { name, email, password },
        { headers: { "X-Api-Key": "mvc-api-secret-key-2026" } }
      );

      const loginResponse = await axios.post(
        "http://localhost:5091/api/auth/login",
        { email, password },
        { headers: { "X-Api-Key": "mvc-api-secret-key-2026" } }
      );

      localStorage.setItem("token", loginResponse.data.token);
      localStorage.setItem("role", loginResponse.data.role);
      localStorage.setItem("email", loginResponse.data.email);
      localStorage.setItem("name", loginResponse.data.name);
      localStorage.setItem("createdAt", loginResponse.data.createdAt);

      navigate("/dashboard");

    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Registration Failed";

      alert(message);
    }
  };


  // FORGOT PASSWORD (SEPARATE)
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5091/api/auth/forgot-password",
        { email: forgotEmail },
        { headers: { "X-Api-Key": "mvc-api-secret-key-2026" } }
      );

      alert("Reset link sent to your email");

      setForgotMode(false);
      setForgotEmail("");

    } catch (error) {
      console.log(error);
      alert("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">

        {/* LEFT SIDE */}

        <div className="left-panel">
          <div className="overlay-content">

            <h1 className="brand-title">
              Voxify
            </h1>

            <h2>
              Feedback Management System
            </h2>

            <p>
              {isLogin
                ? "Manage forms, responses and analytics from one powerful dashboard."
                : "Create your account and start collecting feedback."}
            </p>

            <button
              className="switch-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setName("");
                setEmail("");
                setPassword("");
              }}
            >
              {isLogin
                ? "Create Account"
                : "Back To Login"}
            </button>

          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="right-panel">

          <form
            className="auth-form"
            onSubmit={
              isLogin
                ? handleLogin
                : handleRegister
            }
          >

            <h1>
              {isLogin
                ? "Welcome Back"
                : "Create Account"}
            </h1>

            <p>
              {isLogin
                ? "Sign in to continue"
                : "Register your account"}
            </p>

            {!isLogin && (
              <div className="input-box">
                <User size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />
              </div>
            )}

            <div className="input-box">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="input-box password-box">
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button type="submit" className="submit-btn">
              Login <ArrowRight size={18} />
            </button>

            {isLogin && (
              <div className="forgot-wrap">
                <span
                  onClick={() => navigate("/reset-password")}
                  style={{
                    color: "#7c3aed",
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                >
                  Forgot Password?
                </span>
              </div>
            )}

          </form>
        </div>

      </div>
    </div>
  );
}