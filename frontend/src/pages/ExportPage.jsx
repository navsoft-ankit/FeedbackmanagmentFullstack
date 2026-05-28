import { useState } from "react";

import api from "../api/axios";

import {
  Download,
  FileSpreadsheet
} from "lucide-react";

import "../styles/forms.css";

export default function ExportPage() {

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  // =========================
  // EXPORT CSV
  // =========================

  const exportCSV = async () => {

    if (!fromDate || !toDate) {

      alert(
        "Please select dates"
      );

      return;
    }

    try {

      const res =
        await api.post(

          "/export/feedback",

          {
            fromDate,
            toDate,
            format: 0
          },

          {
            responseType: "blob"
          }
        );

      // DOWNLOAD

      const blob = new Blob(
        [res.data],
        {
          type: "text/csv"
        }
      );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "feedback.csv"
      );

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );

    } catch (err) {

      console.log(err);

      alert(
        "Export Failed"
      );
    }
  };

  return (

    <div className="export-page">

      {/* HEADER */}

      <div className="export-header">

        <div>

          <h1>
            Export Feedback
          </h1>

          <p>
            Download feedback
            reports professionally.
          </p>

        </div>

        <div className="export-icon">

          <FileSpreadsheet
            size={55}
          />

        </div>

      </div>

      {/* EXPORT CARD */}

      <div className="export-card">

        <h2>
          Export CSV Report
        </h2>

        <div className="export-grid">

          {/* FROM DATE */}

          <div>

            <label>
              From Date
            </label>

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

          {/* TO DATE */}

          <div>

            <label>
              To Date
            </label>

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

        </div>

        {/* BUTTON */}

        <button
          className="export-btn"
          onClick={exportCSV}
        >

          <Download size={18} />

          Download CSV

        </button>

      </div>

    </div>
  );
}