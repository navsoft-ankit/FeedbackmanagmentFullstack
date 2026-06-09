import { useState, useRef } from "react";

const defaultData = {
  name: "Janne Doe",
  role: "Student ID",
  idNumber: "NS-2024-047",
  address: "123 Street, Kolkata",
  phone: "+91 999 999 999",
  email: "janne@navsoft.com",
  joinDate: "01/09/2024",
  expireDate: "31/08/2025",
  company: "NAVSOFT",
  tagline: "Your tagline here",
};

function QRCode() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="90" fill="#1B2A5E"/>
      <rect x="8" y="8" width="30" height="30" rx="3" fill="white"/>
      <rect x="13" y="13" width="20" height="20" rx="1" fill="#1B2A5E"/>
      <rect x="17" y="17" width="12" height="12" fill="white"/>
      <rect x="52" y="8" width="30" height="30" rx="3" fill="white"/>
      <rect x="57" y="13" width="20" height="20" rx="1" fill="#1B2A5E"/>
      <rect x="61" y="17" width="12" height="12" fill="white"/>
      <rect x="8" y="52" width="30" height="30" rx="3" fill="white"/>
      <rect x="13" y="57" width="20" height="20" rx="1" fill="#1B2A5E"/>
      <rect x="17" y="61" width="12" height="12" fill="white"/>
      <rect x="45" y="45" width="6" height="6" fill="white"/>
      <rect x="53" y="45" width="6" height="6" fill="white"/>
      <rect x="61" y="45" width="6" height="6" fill="white"/>
      <rect x="69" y="45" width="6" height="6" fill="white"/>
      <rect x="45" y="53" width="6" height="6" fill="white"/>
      <rect x="61" y="53" width="6" height="6" fill="white"/>
      <rect x="45" y="61" width="6" height="6" fill="white"/>
      <rect x="53" y="61" width="6" height="6" fill="white"/>
      <rect x="69" y="61" width="6" height="6" fill="white"/>
      <rect x="45" y="69" width="6" height="6" fill="white"/>
      <rect x="61" y="69" width="6" height="6" fill="white"/>
      <rect x="69" y="77" width="6" height="6" fill="white"/>
      <rect x="53" y="77" width="6" height="6" fill="white"/>
    </svg>
  );
}

function CardFront({ data, photo }) {
  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div style={styles.card}>
      <div style={styles.frontTop}>
        <div style={styles.blobYellow} />
        <div style={styles.blobBlue} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <div>
            <p style={styles.companyLabel}>{data.company}</p>
            <p style={styles.companyName}>{data.tagline}</p>
          </div>
        </div>
        <div style={styles.avatarWrap}>
          {photo ? (
            <img src={photo} alt={data.name} style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarInitials}>{initials}</div>
          )}
        </div>
      </div>

      <div style={styles.frontBottom}>
        <p style={styles.name}>{data.name}</p>
        <p style={styles.role}>
          {data.role} · {data.idNumber}
        </p>
        <div style={styles.navyBar} />
        <InfoRow icon="📍" text={data.address} />
        <InfoRow icon="📞" text={data.phone} />
        <InfoRow icon="✉️" text={data.email} />
      </div>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div style={styles.infoRow}>
      <span style={{ fontSize: 12 }}>{icon}</span>
      <span style={styles.infoText}>{text}</span>
    </div>
  );
}

function CardBack({ data }) {
  return (
    <div style={styles.card}>
      <div style={styles.backTop}>
        <div style={styles.backLogo}>
          <span style={{ fontSize: 16, color: "#1B2A5E" }}>🌐</span>
        </div>
        <div>
          <p style={styles.backCompanyName}>{data.company}</p>
          <p style={styles.backCompanySub}>{data.tagline}</p>
        </div>
      </div>

      <div style={styles.backBody}>
        <div style={styles.validityRow}>
          <span style={styles.validityLabel}>Join :</span>
          <strong style={styles.validityValue}>{data.joinDate}</strong>
        </div>
        <div style={styles.validityRow}>
          <span style={styles.validityLabel}>Expired :</span>
          <strong style={styles.validityValue}>{data.expireDate}</strong>
        </div>
        <p style={styles.backDesc}>
          This card is the property of {data.company}. If found, please return
          to the nearest office or contact us at{" "}
          {data.email.toLowerCase()}.
        </p>
        <div style={styles.qrWrap}>
          <QRCode />
        </div>
      </div>
    </div>
  );
}

export default function IDCard() {
  const [data, setData] = useState(defaultData);
  const [photo, setPhoto] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(defaultData);
  const fileRef = useRef();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    }
  };

  const handleSave = () => {
    setData(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(data);
    setEditing(false);
  };

  const field = (key, label) => (
    <div style={styles.formField}>
      <label style={styles.formLabel}>{label}</label>
      <input
        style={styles.formInput}
        value={draft[key]}
        onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div style={styles.root}>
      <div style={styles.stage}>
        <CardFront data={data} photo={photo} />
        <CardBack data={data} />
      </div>

      <div style={styles.actions}>
        <button style={styles.btn} onClick={() => fileRef.current.click()}>
          Upload Photo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
        <button style={styles.btn} onClick={() => { setDraft(data); setEditing(true); }}>
          Edit Info
        </button>
      </div>

      {editing && (
        <div style={styles.editPanel}>
          <p style={styles.editTitle}>Edit card info</p>
          <div style={styles.formGrid}>
            {field("name", "Full name")}
            {field("role", "Role / title")}
            {field("idNumber", "ID number")}
            {field("address", "Address")}
            {field("phone", "Phone")}
            {field("email", "Email")}
            {field("joinDate", "Join date")}
            {field("expireDate", "Expiry date")}
            {field("company", "Company name")}
            {field("tagline", "Tagline")}
          </div>
          <div style={styles.editActions}>
            <button style={styles.btnPrimary} onClick={handleSave}>Save</button>
            <button style={styles.btn} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  root: { fontFamily: "Inter, sans-serif", padding: "1.5rem 0" },
  stage: {
    background: "#F5A623",
    borderRadius: 16,
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
    gap: 24,
    flexWrap: "wrap",
  },
  card: {
    width: 220,
    borderRadius: 16,
    overflow: "hidden",
    background: "#fff",
  },
  frontTop: {
    background: "#1B2A5E",
    padding: "20px 16px 0",
    position: "relative",
    minHeight: 130,
  },
  blobYellow: {
    position: "absolute",
    width: 50,
    height: 22,
    background: "#F5A623",
    borderRadius: 11,
    top: 18,
    left: 14,
    transform: "rotate(-30deg)",
  },
  blobBlue: {
    position: "absolute",
    width: 50,
    height: 22,
    background: "#378ADD",
    borderRadius: 11,
    top: 32,
    left: 28,
    transform: "rotate(-30deg)",
  },
  companyLabel: { fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px" },
  companyName: { fontSize: 11, color: "#fff", fontWeight: 500 },
  avatarWrap: { display: "flex", justifyContent: "center", paddingTop: 14 },
  avatarImg: {
    width: 72, height: 72, borderRadius: "50%",
    border: "3px solid #fff", objectFit: "cover",
  },
  avatarInitials: {
    width: 72, height: 72, borderRadius: "50%",
    background: "#c8d8e8", border: "3px solid #fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 22, fontWeight: 500, color: "#1B2A5E",
  },
  frontBottom: { background: "#fff", padding: "14px 16px 18px" },
  name: { fontSize: 17, fontWeight: 600, color: "#1B2A5E", textAlign: "center", marginBottom: 2 },
  role: { fontSize: 11, color: "#378ADD", textAlign: "center", letterSpacing: "0.3px", marginBottom: 14 },
  navyBar: { background: "#1B2A5E", height: 4, borderRadius: 2, marginBottom: 14 },
  infoRow: { display: "flex", alignItems: "center", gap: 7, marginBottom: 8 },
  infoText: { fontSize: 11, color: "#444" },
  backTop: {
    background: "#1B2A5E", padding: 16,
    display: "flex", alignItems: "center", gap: 8,
  },
  backLogo: {
    width: 28, height: 28, borderRadius: 6,
    background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
  },
  backCompanyName: { fontSize: 11, fontWeight: 500, color: "#fff" },
  backCompanySub: { fontSize: 9, color: "rgba(255,255,255,0.55)" },
  backBody: { background: "#fff", padding: "14px 16px" },
  validityRow: { display: "flex", gap: 6, fontSize: 11, color: "#444", marginBottom: 4 },
  validityLabel: { color: "#888" },
  validityValue: { color: "#1B2A5E", fontWeight: 500 },
  backDesc: { fontSize: 10, color: "#888", lineHeight: 1.6, margin: "10px 0" },
  qrWrap: {
    background: "#1B2A5E", borderRadius: 10,
    padding: 10, display: "flex", justifyContent: "center",
  },
  actions: { display: "flex", gap: 10, justifyContent: "center", marginTop: 16 },
  btn: {
    padding: "8px 18px", borderRadius: 8, border: "1px solid #ccc",
    background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500,
  },
  btnPrimary: {
    padding: "8px 18px", borderRadius: 8, border: "none",
    background: "#1B2A5E", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500,
  },
  editPanel: {
    marginTop: 20, background: "#f9f9f9",
    border: "1px solid #e0e0e0", borderRadius: 12, padding: 20,
    maxWidth: 520, marginInline: "auto",
  },
  editTitle: { fontSize: 14, fontWeight: 600, color: "#1B2A5E", marginBottom: 14 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  formField: { display: "flex", flexDirection: "column", gap: 4 },
  formLabel: { fontSize: 11, color: "#888", fontWeight: 500 },
  formInput: {
    padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd",
    fontSize: 12, color: "#333", outline: "none",
  },
  editActions: { display: "flex", gap: 10, marginTop: 16 },
};