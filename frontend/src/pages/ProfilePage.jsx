import { useState, useRef } from "react";
import "../styles/profile.css";
import { QRCodeCanvas } from "qrcode.react";

const name = localStorage.getItem("name") || "";
const email = localStorage.getItem("email") || "";
const role = localStorage.getItem("role") || "User";

const today = new Date();

const expiry = new Date();
expiry.setFullYear(expiry.getFullYear() + 1);

const defaultData = {
  name,
  role,
  idNumber: "",
  address: "",
  phone: "",
  email,
  joinDate: today.toLocaleDateString(),
  expireDate: expiry.toLocaleDateString(),
  company: "VOXIFY",
};

const savedData = localStorage.getItem("idCardData");

const initialData = savedData
  ? JSON.parse(savedData)
  : defaultData;

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
          <div className="profile-avatar">
            {photo ? (
              <img src={photo} alt={data.name} />
            ) : (
              <div className="avatar-initials">
                {initials}
              </div>
            )}
          </div>

          <div className="profile-details">
            <h1>{data.name}</h1>
            <p>{data.role}</p>
            <span>{data.company}</span>
          </div>

          <div className="profile-actions">
            <button
              className="btn"
              onClick={() => fileRef.current?.click()}
            >
              Upload Photo
            </button>

            <button
              className="btn"
              onClick={() => {
                setDraft(data);
                setEditing(true);
              }}
            >
              Edit Profile
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
              <span>{data.expireDate}</span>
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