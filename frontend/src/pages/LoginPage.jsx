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

  // LOGIN

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:5091/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "X-Api-Key": "mvc-api-secret-key-2026",
          },
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      localStorage.setItem(
        "email",
        email
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert("Invalid Email or Password");

    }
  };

  // REGISTER + AUTO LOGIN

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      // REGISTER

      await axios.post(
        "http://localhost:5091/api/auth/register",
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "X-Api-Key": "mvc-api-secret-key-2026",
          },
        }
      );

      // AUTO LOGIN

      const loginResponse = await axios.post(
        "http://localhost:5091/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "X-Api-Key": "mvc-api-secret-key-2026",
          },
        }
      );

      localStorage.setItem(
        "token",
        loginResponse.data.token
      );

      localStorage.setItem(
        "role",
        loginResponse.data.role
      );

      localStorage.setItem(
        "email",
        email
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert("Registration Failed");

    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">

        {/* LEFT SIDE */}

        <div className="left-panel">
          <div className="overlay-content">

            <h1 className="brand-title">
              Navsoft Feedback
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
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <span
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />}
              </span>
            </div>

            <button
              type="submit"
              className="submit-btn"
            >
              {isLogin
                ? "Login"
                : "Register"}

              <ArrowRight size={18} />
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}