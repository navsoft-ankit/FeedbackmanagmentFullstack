import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Download,
  LogOut,
  Users,
  Bell,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import "../styles/dashboard.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role" || "")
  .trim()
  .toLowerCase();
  const email = localStorage.getItem("email");

  const [stats, setStats] = useState({
    totalForms: 0,
    totalFeedbacks: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">

      {/* ── SIDEBAR ── */}
      <div className="sidebar">
        <div>
          <div className="logo">
            <h1>Navsoft</h1>
            <p>Feedback System</p>
          </div>

          {/* ADMIN MENU */}
          {role === "admin" && (
            <>
              <div
                className="menu-item active"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </div>

              <div
                className="menu-item"
                onClick={() => navigate("/create-form")}
              >
                <FilePlus size={18} />
                <span>Create Form</span>
              </div>

              <div
                className="menu-item"
                onClick={() => navigate("/forms")}
              >
                <FileText size={18} />
                <span>Manage Forms</span>
              </div>



              <div
                className="menu-item"
                onClick={() => navigate("/export")}
              >
                <Download size={18} />
                <span>Export CSV</span>
              </div>
            </>
          )}

          {/* USER MENU */}
          {role === "user" && (
            <>
              <div
                className="menu-item active"
                onClick={() => navigate("/forms")}
              >
                <FileText size={18} />
                <span>Fill Forms</span>
              </div>

              <div
                className="menu-item"
                onClick={() => navigate("/submitted-forms")}
              >
                <BarChart3 size={18} />
                <span>Submitted Forms</span>
              </div>
            </>
          )}
        </div>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={logout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      {/* ── MAIN ── */}
      <div className="main-content">

        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <h1>{role === "admin" ? "Admin Dashboard" : "User Dashboard"}</h1>
            <p>Welcome back, {email}</p>
          </div>
          <div className="top-icons">
            <div className="icon-box">
              <Bell size={18} />
            </div>
            <div className="profile-box">
              {email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* ── ADMIN VIEW ── */}
        {role === "admin" && (
          <>
            {/* STATS */}
            <div className="cards">
              <div className="card">
                <h2>{stats.totalForms}</h2>
                <p>Total Forms</p>
              </div>
              <div className="card">
                <h2>{stats.totalFeedbacks}</h2>
                <p>Total Feedbacks</p>
              </div>
              <div className="card">
                <h2>24</h2>
                <p>Active Users</p>
              </div>
            </div>

            {/* HERO */}
            <div className="hero-card">
              <div>
                <h2>Manage Feedback Efficiently </h2>
                <p>
                  Create forms, monitor responses, export reports and manage
                  everything from one powerful dashboard.
                </p>
                <button onClick={() => navigate("/create-form")}>
                  Create New Form
                </button>
              </div>
            </div>

            {/* DETAILS */}
            <div className="details-section">
              <div className="details-card">
                <h3>Recent Activities</h3>
                <div className="activity-item">New feedback submitted</div>
                <div className="activity-item">New form created</div>
                <div className="activity-item">CSV exported successfully</div>
              </div>

              <div className="details-card">
                <h3>Quick Actions</h3>
                <button
                  className="action-btn"
                  onClick={() => navigate("/create-form")}
                >
                  <FilePlus size={15} /> Create Form
                  <ChevronRight size={14} style={{ marginLeft: "auto" }} />
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/forms")}
                >
                  <FileText size={15} /> Manage Forms
                  <ChevronRight size={14} style={{ marginLeft: "auto" }} />
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/export")}
                >
                  <Download size={15} /> Export CSV
                  <ChevronRight size={14} style={{ marginLeft: "auto" }} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── USER VIEW ── */}
        {role === "user" && (
          <>
            {/* HERO */}
            <div className="hero-card">
              <div>
                <h2>Welcome User </h2>
                <p>
                  Fill feedback forms and submit responses quickly using the
                  smart feedback management system.
                </p>
                <button onClick={() => navigate("/forms")}>Fill Forms</button>
              </div>
            </div>

            {/* STATS */}
            <div className="cards">
              <div className="card">
                <h2>12</h2>
                <p>Available Forms</p>
              </div>
              <div className="card">
                <h2>8</h2>
                <p>Submitted Forms</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}