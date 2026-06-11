import { useState } from "react";
import api from "../api/axios";
import { Download, FileSpreadsheet } from "lucide-react";
import "../styles/forms.css";

export default function ExportPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [email, setEmail] = useState("");

  // ================= EXPORT CSV =================
  const exportCSV = async () => {
    if (!fromDate || !toDate || !email) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await api.post(
        "/export/feedback",
        {
          fromDate,
          toDate,
          email,
          format: 0
        },
        {
          responseType: "blob"
        }
      );

      const blob = new Blob([res.data], {
        type: "text/csv"
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "feedback.csv");

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      alert("Export Failed");
    }
  };

  return (
  <div className="export-page">

    {/* HEADER */}
    <div className="export-header">

      <div>
        <span className="page-tag">
          REPORT CENTER
        </span>

        <h1>Export Feedback Reports</h1>

        <p>
          Generate and download professional feedback reports
          filtered by user and date range.
        </p>
      </div>

      <button
        className="export-btn-header"
        onClick={exportCSV}
      >
        <Download size={18} />
        Export CSV
      </button>

    </div>

    {/* STATS */}
    <div className="export-stats">

      <div className="stat-card">
        <span>Format</span>
        <h3>CSV</h3>
      </div>

      <div className="stat-card">
        <span>Date Range</span>
        <h3>Custom</h3>
      </div>

      <div className="stat-card">
        <span>Reports</span>
        <h3>Feedback</h3>
      </div>

      <div className="stat-card">
        <span>Status</span>
        <h3>Ready</h3>
      </div>

    </div>

    {/* MAIN LAYOUT */}
    <div className="export-layout">

      {/* LEFT */}
      <div className="export-card">

        <div className="card-header">
          <h2>Export Configuration</h2>
          <span>
            Configure report filters
          </span>
        </div>

        <div className="export-grid">

          <div className="form-group">
            <label>From Date</label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>To Date</label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group email-field">
            <label>User Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="employee@company.com"
            />
          </div>

        </div>

        <button
          className="export-btn"
          onClick={exportCSV}
        >
          <Download size={18} />
          Download CSV Report
        </button>

      </div>

      {/* RIGHT */}
      <div className="preview-card">

        <div className="preview-icon">
          <FileSpreadsheet size={60} />
        </div>

        <h2>Report Preview</h2>

        <p>
          Your exported report will contain:
        </p>

        <ul className="preview-list">
          <li>Feedback Records</li>
          <li>User Information</li>
          <li>Submission Dates</li>
          <li>Question Responses</li>
          <li>CSV Compatible Format</li>
        </ul>

        <div className="preview-info">

          <div>
            <span>From</span>
            <strong>
              {fromDate || "--"}
            </strong>
          </div>

          <div>
            <span>To</span>
            <strong>
              {toDate || "--"}
            </strong>
          </div>

          <div>
            <span>Email</span>
            <strong>
              {email || "--"}
            </strong>
          </div>

        </div>

      </div>

    </div>

  </div>
);
}