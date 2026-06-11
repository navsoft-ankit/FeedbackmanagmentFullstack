import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

import { Eye, Pencil, Trash2, FileText } from "lucide-react";

import "../styles/forms.css";

export default function FormsPage() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchForms();
  }, []); // just fetch once, refresh manually after actions

  // ================= FETCH FORMS =================
  const fetchForms = async () => {
    try {
      let res;
      if (role === "Admin") {
        res = await api.get("/forms/all-public");
      } else {
        res = await api.get("/feedback/available-forms");
      }
      setForms(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE FORM =================
  const deleteForm = async (id) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;

    try {
      await api.delete(`/forms/${id}`);
      alert("Deleted Successfully");
      fetchForms(); // refresh list
    } catch (err) {
      console.log(err);
      alert("Error deleting form");
    }
  };

  return (
    <div className="forms-page">
      {/* HEADER */}
      <div className="forms-header">
        <div>
          <h1>Manage Forms</h1>
          <p>Manage all feedback forms professionally.</p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {forms.length === 0 && (
        <div className="empty-box">
          <FileText size={60} />
          <h2>No Forms Available</h2>
        </div>
      )}

      {/* GRID */}
      <div className="forms-grid">
        {forms.map((form) => (
          <div className="form-card" key={form.id}>
            <h3>{form.title}</h3>
            <p>{form.description}</p>

            {/* USER */}
            {role === "User" && (
              <button
                className="primary-btn"
                onClick={() => navigate(`/feedback/${form.id}`)}
              >
                <Eye size={16} /> Fill Form
              </button>
            )}

            {/* ADMIN */}
            {role === "Admin" && (
              <div className="action-group">
                <button
                  className="view-btn"
                  onClick={() => navigate(`/admin/forms/view/${form.id}`)}
                >
                  <Eye size={16} /> View
                </button>

                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-form/${form.id}`)}
                >
                  <Pencil size={16} /> Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteForm(form.id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}