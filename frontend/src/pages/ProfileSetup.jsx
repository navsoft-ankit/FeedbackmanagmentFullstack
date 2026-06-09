import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultData = {
  name: "",
  email: "",
  role: "User",
  idNumber: "",
  address: "",
  phone: "",
  joinDate: "",
  expireDate: "",
  company: "NAVSOFT",
  tagline: "Your tagline here",
};

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = required info, 2 = full form
  const [form, setForm] = useState(defaultData);

  // preload email from login
  useEffect(() => {
    const email = localStorage.getItem("email") || "";
    const role = localStorage.getItem("role") || "User";

    setForm((prev) => ({
      ...prev,
      email,
      role: role.charAt(0).toUpperCase() + role.slice(1),
    }));
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleNext = () => {
    if (!form.name || !form.email) {
      alert("Name and Email required!");
      return;
    }

    // auto join date
    if (!form.joinDate) {
      const today = new Date().toISOString().split("T")[0];
      form.joinDate = today;
    }

    setStep(2);
  };

  const handleSave = () => {
    // expiry auto 1 year
    const join = new Date(form.joinDate);
    const exp = new Date(join);
    exp.setFullYear(exp.getFullYear() + 1);

    const finalData = {
      ...form,
      expireDate: exp.toISOString().split("T")[0],
    };

    localStorage.setItem("profileData", JSON.stringify(finalData));

    alert("Profile saved successfully!");
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Profile Setup</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              placeholder="Full Name *"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="Email *"
              value={form.email}
              disabled
              style={{ ...styles.input, background: "#eee" }}
            />

            <button style={styles.btn} onClick={handleNext}>
              Next
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              placeholder="Role / Title"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="ID Number"
              value={form.idNumber}
              onChange={(e) => handleChange("idNumber", e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="Company"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="Tagline"
              value={form.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
              style={styles.input}
            />

            <button style={styles.btnPrimary} onClick={handleSave}>
              Save Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1220",
  },
  card: {
    width: 400,
    padding: 20,
    background: "#fff",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  input: {
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 8,
  },
  btn: {
    padding: 10,
    background: "#1B2A5E",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnPrimary: {
    padding: 10,
    background: "green",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};