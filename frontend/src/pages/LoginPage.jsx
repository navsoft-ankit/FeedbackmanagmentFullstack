import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  ArrowRight
} from "lucide-react";

import "../styles/auth.css";

export default function LoginPage() {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

        {/* LEFT PANEL */}

        <div className="left-panel">

          <div className="overlay-content">

            <h1 className="brand-title">
              Navsoft
            </h1>

            <h2>
              Feedback Management System
            </h2>

            <p>
              {isLogin
                ? "Manage feedback smartly and securely."
                : "Create your account and start your journey."}
            </p>

            <button
              className="switch-btn"
              onClick={() =>
                setIsLogin(!isLogin)
              }
            >

              {isLogin
                ? "Register"
                : "Login"}

            </button>

          </div>

        </div>

        {/* RIGHT PANEL */}

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
                ? "Login"
                : "Register"}
            </h1>

            <p>
              {isLogin
                ? "Sign in to your account"
                : "Create a new account"}
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

            <div className="input-box">

              <Lock size={18} />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

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