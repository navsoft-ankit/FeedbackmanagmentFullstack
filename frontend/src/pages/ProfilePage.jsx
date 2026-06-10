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
ID:${data.idNumber}`}
      size={180}
      bgColor="#ffffff"
      fgColor="#1B2A5E"
      level="H"
      includeMargin
    />
  );
}

export default function ProfilePage() {
    const navigate = useNavigate();
  const name = localStorage.getItem("name") || "";
  const email = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "User";

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
  idNumber: "",
  address: "",
  phone: "",
  email,
joinDate: joinDateObj.toLocaleDateString(),
expireDate: expiryDateObj.toLocaleDateString(),
  company: "VOXIFY",
};

  const savedData = localStorage.getItem("idCardData");

  const initialData = savedData
    ? JSON.parse(savedData)
    : defaultData;
  const [data, setData] = useState(initialData);
  const [draft, setDraft] = useState(initialData);
  const [editing, setEditing] = useState(false);

  const [photo, setPhoto] = useState(
    localStorage.getItem("idCardPhoto") || null
  );

  const fileRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPhoto(reader.result);
      localStorage.setItem("idCardPhoto", reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setData(draft);

    localStorage.setItem(
      "idCardData",
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

        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {photo ? (
                  <img src={photo} alt={data.name} />
                ) : (
                  <div className="avatar-initials">
                    {initials}
                  </div>
                )}
              </div>

              <span className="online-dot"></span>
            </div>

            <div className="profile-details">
              <div className="brand-chip">
                <span className="brand-dot"></span>
                {data.company}
              </div>

              <h1>{data.name}</h1>

              <div className="role-pill">
                <span className="role-dot"></span>
                {data.role}
              </div>
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
<button
  className="btn-p"
  onClick={() => navigate("/")}
>
  Log Out
</button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <h3>Personal Information</h3>

            <div className="info-item">
              <label>Full Name</label>
              <span>{data.name}</span>
            </div>

            <div className="info-item">
              <label>Email</label>
              <span>{data.email}</span>
            </div>

            <div className="info-item">
              <label>Phone</label>
              <span>{data.phone || "Not Added"}</span>
            </div>

            <div className="info-item">
              <label>Address</label>
              <span>{data.address || "Not Added"}</span>
            </div>
          </div>

          <div className="profile-card">
            <h3>Company Information</h3>

            <div className="info-item">
              <label>Role</label>
              <span>{data.role}</span>
            </div>

            <div className="info-item">
              <label>ID Number</label>
              <span>{data.idNumber || "Not Assigned"}</span>
            </div>

            <div className="info-item">
              <label>Join Date</label>
              <span>{data.joinDate}</span>
            </div>

            <div className="info-item">
              <label>Expiry Date</label>
              <div className="expiry-row">
                <span>{data.expireDate}</span>
<span className="expiry-badge">
  {daysLeft}d left
</span>
              </div>
            </div>
          </div>

          <div className="profile-card qr-card">
            <h3>Profile QR Code</h3>

            <div className="qr-box">
              <QRCode data={data} />
            </div>
          </div>
        </div>

        {editing && (
          <div className="edit-panel">
            <h2>Edit Profile</h2>

            <div className="form-grid">
              {field("name", "Full Name")}
              {field("role", "Role")}
              {field("idNumber", "ID Number")}
              {field("address", "Address")}
              {field("phone", "Phone")}
              {field("email", "Email")}
              {field("joinDate", "Join Date")}
              {field("expireDate", "Expiry Date")}
              {field("company", "Company")}
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
      </div>
    </div>
  );
}