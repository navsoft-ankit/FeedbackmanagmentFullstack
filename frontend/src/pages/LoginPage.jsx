import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5091/api/auth/login",
        { email, password },
        { headers: { "X-Api-Key": "mvc-api-secret-key-2026" } }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("createdAt", response.data.createdAt);
      localStorage.setItem("employeeId", response.data.employeeId);
      navigate("/dashboard");
    } catch {
      alert("Invalid email or password");
    }
  };

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
      localStorage.setItem("employeeId", loginResponse.data.employeeId);
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data || "Registration failed";
      alert(message);
    }
  };

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
    } catch {
      alert("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* LEFT PANEL */}
        <div className="auth-left">
<div className="auth-logo-row">
  <img
    src="/image.png"
    alt="Voxify Logo"
    className="auth-logo-img"
  />
  <span className="auth-logo-text">Voxify</span>
</div>

          {forgotMode ? (
            <div className="auth-form-wrap">
              <h2>Reset password</h2>
              <p className="auth-sub">We'll send a reset link to your email.</p>
              <form onSubmit={handleForgotPassword}>
                <div className="auth-field">
                  <label>Email address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="auth-btn-primary" disabled={loading}>
                  {loading ? "Sending…" : "Send reset link"}
                </button>
                <button
                  type="button"
                  className="auth-back"
                  onClick={() => setForgotMode(false)}
                >
                  ← Back to sign in
                </button>
              </form>
            </div>
          ) : (
            <div className="auth-form-wrap">
              <h2>{isLogin ? "Welcome back" : "Create account"}</h2>
              <p className="auth-sub">
                {isLogin ? "Please enter your details" : "Fill in your details to register"}
              </p>
              <form onSubmit={isLogin ? handleLogin : handleRegister}>
                {!isLogin && (
                  <div className="auth-field">
                    <label>Full name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="auth-field">
                  <label>Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {isLogin && (
                  <div className="auth-remember-row">
                    <label className="auth-remember">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />
                      Remember for 30 days
                    </label>
                    <button
                      type="button"
                      className="auth-forgot"
                      onClick={() => setForgotMode(true)}
                    >
                      Forgot password
                    </button>
                  </div>
                )}
                <button type="submit" className="auth-btn-primary">
                  {isLogin ? "Sign in" : "Register"}
                </button>
                {isLogin && (
                  <button type="button" className="auth-btn-google">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </button>
                )}
                <div className="auth-switch">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  {" "}
                  <button type="button" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <div className="illus-icon illus-icon--chat">💬</div>
          <div className="illus-icon illus-icon--headset">🎧</div>
          <div className="illus-icon illus-icon--globe">🌐</div>
          <div className="illus-icon illus-icon--phone">📞</div>
          <div className="illus-icon illus-icon--mail">✉️</div>
          <div className="illus-x x1">×</div>
          <div className="illus-x x2">×</div>
          <div className="illus-x x3">×</div>
          <div className="illus-x x4">×</div>
          <div className="illus-character">
            <div className="char-monitor">
              <div className="char-screen">
                <div className="char-check">✓</div>
              </div>
            </div>
            <div className="char-stand" />
            <div className="char-base" />
            <div className="char-hair" />
            <div className="char-head" />
            <div className="char-body" />
            <div className="char-arm" />
            <div className="char-hand">👌</div>
          </div>
          <div className="illus-wavy">~ ~ ~</div>
        </div>

      </div>
    </div>
  );
}