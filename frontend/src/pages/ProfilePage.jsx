import { useState, useRef } from "react";
import "../styles/profile.css";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";


function QRCode({ data }) {
  return (
    <QRCodeCanvas
      value={`Name:${data.name}
              Role:${data.role}
              Email:${data.email}
              ID:${data.idNumber}`
      }
      size={180}
      bgColor="#ffffff"
      fgColor="#1B2A5E"
      level="H"
      includeMargin
    />
  );
}

<div className="profile-title">
  <h1>My Profile</h1>
  <p>Manage your account information and settings.</p>
</div>
export default function ProfilePage() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "";
  const email = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "User";
  const employeeId = localStorage.getItem("employeeId") || "";

  const createdAt = localStorage.getItem("createdAt");

  const joinDateObj = createdAt
    ? new Date(createdAt)
    : new Date();

  const expiryDateObj = new Date(joinDateObj);
  expiryDateObj.setFullYear(
    expiryDateObj.getFullYear() + 1
  );

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (expiryDateObj - new Date()) /
      (1000 * 60 * 60 * 24)
    )
  );

  const defaultData = {
    name,
    role,
    idNumber: employeeId,
    address: "",
    phone: "",
    email,
    joinDate: joinDateObj.toLocaleDateString(),
    expireDate: expiryDateObj.toLocaleDateString(),
    company: "VOXIFY",
  };
  const userKey = `idCardData_${email}`;

  const savedData = localStorage.getItem(userKey);

  const initialData = savedData
    ? {
      ...JSON.parse(savedData),
      name,
      email,
      role,
      idNumber: employeeId,
      company: "VOXIFY",
    }
    : defaultData;
  const [data, setData] = useState(initialData);
  const [draft, setDraft] = useState(initialData);
  const [editing, setEditing] = useState(false);

  const [photo, setPhoto] = useState(
    localStorage.getItem(`idCardPhoto_${email}`) || null
  );
  const fileRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPhoto(reader.result);
      localStorage.setItem(
        `idCardPhoto_${email}`,
        reader.result
      );
    };

    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setData(draft);

    localStorage.setItem(
      userKey,
      JSON.stringify(draft)
    );

    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(data);
    setEditing(false);
  };

  const field = (key, label) => (
    <div className="form-field">
      <label className="form-label">{label}</label>

      <input
        className="form-input"
        value={draft[key]}
        onChange={(e) =>
          setDraft({
            ...draft,
            [key]: e.target.value,
          })
        }
      />
    </div>
  );

  const initials = (data.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="profile-page">
      <div className="profile-container">

<section className="profile-hero">

  <div className="profile-hero-left">

    <div className="profile-avatar">
      {photo ? (
        <img src={photo} alt="" />
      ) : (
        <div className="avatar-initials">
          {initials}
        </div>
      )}
    </div>

    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>

      <span className="hero-role">
        {data.role}
      </span>
    </div>

  </div>

  <div className="profile-actions">

    <button
      className="btn"
      onClick={() => fileRef.current?.click()}
    >
      Upload Photo
    </button>

    <button
      className="btn-primary"
      onClick={() => {
        setDraft(data);
        setEditing(true);
      }}
    >
      Edit Profile
    </button>

  </div>

</section>

       <section className="profile-stats">

  <div className="profile-stat-card">
    <h4>Full Name</h4>
    <h2>{data.name}</h2>
  </div>

  <div className="profile-stat-card">
    <h4>Email</h4>
    <h2>{data.email}</h2>
  </div>

  <div className="profile-stat-card">
    <h4>Role</h4>
    <h2>{data.role}</h2>
  </div>

  <div className="profile-stat-card">
    <h4>ID Number</h4>
    <h2>{data.idNumber || "N/A"}</h2>
  </div>

  <div className="profile-stat-card">
    <h4>Join Date</h4>
    <h2>{data.joinDate}</h2>
  </div>

  <div className="profile-stat-card">
    <h4>Expiry</h4>
    <h2>{daysLeft} Days</h2>
  </div>

</section>

        {editing && (
          <div className="edit-panel">
            <h2>Edit Profile</h2>

            <div className="form-grid">
              {field("name", "Full Name")}
              {field("address", "Address")}
              {field("phone", "Phone")}
            </div>

            <div className="edit-actions">
              <button
                className="btn-primary"
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className="btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
          

        )}
        <section className="qr-section">

  <h2>Profile QR Code</h2>

  <div className="qr-box">
    <QRCode data={data} />
  </div>

</section>

      </div>
    </div>
  );
}