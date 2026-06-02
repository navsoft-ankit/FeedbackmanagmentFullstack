import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Download,
  LogOut,
  Bell,
  BarChart3,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import "../styles/dashboard.css";

export default function DashboardPage() {
  const navigate = useNavigate();

  const role = (localStorage.getItem("role") || "")
    .trim()
    .toLowerCase();

  const email = localStorage.getItem("email");

  const [stats, setStats] = useState({
    totalForms: 0,
    totalFeedbacks: 0,
  });

  const [activeUsers, setActiveUsers] = useState(0);
  const [recentResponses, setRecentResponses] = useState([]);

  const [showProfile, setShowProfile] = useState(false);
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    if (email) {
      fetchStats();
      if (role === "admin") {
        fetchRecentResponses();
      }
    }
  }, [email]);

  const fetchStats = async () => {
    try {
      if (role === "admin") {
        const [statsRes, usersRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/auth/active-users-count"),
        ]);

        setStats({
          totalForms: statsRes.data.totalForms,
          totalFeedbacks: statsRes.data.totalFeedbacks,
        });

        setActiveUsers(usersRes.data.activeUsers || 0);
      } else {
        const statsRes = await api.get(`/forms/user-stats?email=${email}`);
        setStats({
          totalForms: statsRes.data.availableForms,
          totalFeedbacks: statsRes.data.submittedForms,
        });
      }
    } catch (err) {
      console.error("Dashboard stats error:", err);
    }
  };

  const fetchRecentResponses = async () => {
    try {
      const res = await api.get("/feedback/all");
      setRecentResponses(res.data.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      {/* SIDEBAR */}
      <div className="sidebar">
        <div>
          <div className="logo">
            <h1>Navsoft</h1>
            <p>Feedback System</p>
          </div>

          {role === "admin" && (
            <>
              <div className="menu-item active" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </div>

              <div className="menu-item" onClick={() => navigate("/create-form")}>
                <FilePlus size={18} />
                <span>Create Form</span>
              </div>

              <div className="menu-item" onClick={() => navigate("/forms")}>
                <FileText size={18} />
                <span>Manage Forms</span>
              </div>

              <div className="menu-item" onClick={() => navigate("/responses")}>
                <MessageSquare size={18} />
                <span>Responses</span>
              </div>

              <div className="menu-item" onClick={() => navigate("/export")}>
                <Download size={18} />
                <span>Export CSV</span>
              </div>
            </>
          )}

          {role === "user" && (
            <>
              <div className="menu-item active" onClick={() => navigate("/forms")}>
                <FileText size={18} />
                <span>Fill Forms</span>
              </div>

              <div className="menu-item" onClick={() => navigate("/submitted-forms")}>
                <BarChart3 size={18} />
                <span>Submitted Forms</span>
              </div>
            </>
          )}
        </div>

        <button onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <button className="logout-btn" onClick={logout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      {/* MAIN CONTENT */}
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

            <div className="profile-box" onClick={toggleProfile} style={{ cursor: "pointer" }}>
              {email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* PROFILE POPUP */}
        {showProfile && (
          <div className="profile-popup">
            <div className="profile-card">
              <h3>{role === "admin" ? "Admin Profile" : "User Profile"}</h3>
              <p>
                <b>Name:</b> {email?.split("@")[0]}
              </p>
              <p>
                <b>Email:</b> {email}
              </p>
              <button onClick={toggleProfile}>Close</button>
            </div>
          </div>
        )}

        {/* ADMIN VIEW */}
        {role === "admin" && (
          <>
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
                <h2>{activeUsers}</h2>
                <p>Active Users</p>
              </div>
            </div>

            <div className="hero-card">
              <div>
                <h2>Manage Feedback Efficiently</h2>
                <p>Create forms, monitor responses, export reports and manage everything from one powerful dashboard.</p>
                <button onClick={() => navigate("/create-form")}>Create New Form</button>
              </div>
            </div>

            <div className="details-section">
              {/* Recent Activities */}
              <div className="details-card">
                <h3>Recent Activities</h3>
                <div className="activity-item">New feedback submitted</div>
                <div className="activity-item">New form created</div>
                <div className="activity-item">Check User Response</div>
                <div className="activity-item">CSV exported successfully</div>
              </div>

              {/* Quick Actions */}
              <div className="details-card">
                <h3>Quick Actions</h3>
                <button className="action-btn" onClick={() => navigate("/create-form")}>
                  <FilePlus size={15} /> Create Form
                  <ChevronRight style={{ marginLeft: "auto" }} size={14} />
                </button>

                <button className="action-btn" onClick={() => navigate("/forms")}>
                  <FileText size={15} /> Manage Forms
                  <ChevronRight style={{ marginLeft: "auto" }} size={14} />
                </button>

                <button className="action-btn" onClick={() => navigate("/responses")}>
                  <MessageSquare size={15} /> Responses
                  <ChevronRight style={{ marginLeft: "auto" }} size={14} />
                </button>

                <button className="action-btn" onClick={() => navigate("/export")}>
                  <Download size={15} /> Export CSV
                  <ChevronRight style={{ marginLeft: "auto" }} size={14} />
                </button>
              </div>
            </div>

            {/* Recent Responses */}
            <div className="details-card" style={{ marginTop: 20 }}>
              <h3>Recent Responses</h3>
              {recentResponses.length === 0 ? (
                <p>No responses found</p>
              ) : (
                recentResponses.map((r) => (
                  <div
                    key={r.id}
                    className="activity-item"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <div>
                      <strong>{r.name}</strong>
                      <p>{r.formTitle}</p>
                    </div>
                    <button onClick={() => navigate(`/admin-feedbacks/${r.formId}`)}>View</button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* USER VIEW */}
        {role === "user" && (
          <>
            <div className="hero-card">
              <div>
                <h2>Welcome User</h2>

                <p>
                  Fill feedback forms and submit responses
                  quickly using the smart system.
                </p>

                <button onClick={() => navigate("/forms")}>
                  Fill Forms
                </button>
              </div>
            </div>

            <div className="cards">
              <div className="card">
                <h2>{stats.totalForms}</h2>
                <p>Available Forms</p>
              </div>

              <div className="card">
                <h2>{stats.totalFeedbacks}</h2>
                <p>Submitted Forms</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}