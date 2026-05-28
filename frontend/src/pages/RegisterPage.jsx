import { useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import "../styles/auth.css";

export default function LoginPage() {

  const [isLogin, setIsLogin] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (isLogin) {

        const response = await loginUser({
          email,
          password
        });

        console.log(response);

        localStorage.setItem("token", response.token);

        alert("Login Success");

      } else {

        const response = await registerUser({
          name,
          email,
          password
        });

        console.log(response);

        alert("Registration Success");

        setIsLogin(true);
      }

    } catch (error) {

      console.log(error);

      alert(isLogin ? "Login Failed" : "Registration Failed");
    }
  };

  return (

    <div className="auth-container">

      <div className="auth-box">

        <h1>Navsoft</h1>

        <p>Feedback Management System</p>

        <div className="switch-text">

          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <span onClick={() => setIsLogin(false)}>
                Sign Up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setIsLogin(true)}>
                Sign In
              </span>
            </p>
          )}

        </div>

        <form onSubmit={handleSubmit}>

          {!isLogin && (

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="submit-btn">

            {isLogin ? "Login" : "Register"}

          </button>

        </form>

      </div>

    </div>
  );
}