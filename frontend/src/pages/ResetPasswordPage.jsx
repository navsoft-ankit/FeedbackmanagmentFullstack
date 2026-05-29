import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = decodeURIComponent(params.get("email") || "");
  const token = decodeURIComponent(params.get("token") || "");

  const [newPassword, setNewPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    // ✅ guard
    if (!email || !token) {
      alert("Invalid reset link");
      return;
    }

    try {
      await axios.post("http://localhost:5091/api/auth/reset-password", {
        Email: email,
        Token: token,
        NewPassword: newPassword,
      });

      alert("Password reset successful");
      navigate("/");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data || "Reset failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reset Password</h2>

      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit">Reset</button>
      </form>
    </div>
  );
}