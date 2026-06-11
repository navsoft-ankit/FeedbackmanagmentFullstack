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
      <div className="forms-toolbar">

        <div>
          <span className="page-tag">
            FORM MANAGEMENT
          </span>

          <h1>
            {role === "Admin"
              ? "Manage Forms"
              : "Available Forms"}
          </h1>

          <p>
            {role === "Admin"
              ? "Create, edit and manage all feedback forms."
              : "Select and complete available forms."}
          </p>
        </div>

        {role === "Admin" && (
          <button
            className="create-form-btn"
            onClick={() =>
              navigate("/create-form")
            }
          >
            + Create Form
          </button>
        )}

      </div>

      {/* STATS */}

      <div className="forms-overview">

        <div className="overview-card">
          <span>Total Forms</span>
          <h2>{forms.length}</h2>
        </div>

        <div className="overview-card">
          <span>Role</span>
          <h2>{role}</h2>
        </div>

        <div className="overview-card">
          <span>Status</span>
          <h2>Active</h2>
        </div>

      </div>

      {/* EMPTY */}

      {forms.length === 0 ? (

        <div className="empty-table">

          <FileText size={70} />

          <h3>No Forms Found</h3>

          <p>
            Create a new form to get started.
          </p>

        </div>

      ) : (

        <div className="forms-table">

          <div className="table-header">

            <div>Form Name</div>

            <div>Description</div>

            <div>Status</div>

            <div>Actions</div>

          </div>

          {forms.map((form) => (

            <div
              key={form.id}
              className="table-row"
            >

              <div className="form-title-cell">

                <div className="table-icon">
                  <FileText size={18} />
                </div>

                <div>

                  <h4>{form.title}</h4>

                </div>

              </div>

              <div className="desc-cell">
                {form.description}
              </div>

              <div>
                <span className="status-pill">
                  Active
                </span>
              </div>

              <div className="action-buttons">

                {role === "User" ? (

                  <button
                    className="fill-btn"
                    onClick={() =>
                      navigate(
                        `/feedback/${form.id}`
                      )
                    }
                  >
                    <Eye size={16} />
                    Fill Form
                  </button>

                ) : (

                  <>
                    <button
                      className="icon-btn view"
                      onClick={() =>
                        navigate(
                          `/admin/forms/view/${form.id}`
                        )
                      }
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      className="icon-btn edit"
                      onClick={() =>
                        navigate(
                          `/edit-form/${form.id}`
                        )
                      }
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="icon-btn delete"
                      onClick={() =>
                        deleteForm(form.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}