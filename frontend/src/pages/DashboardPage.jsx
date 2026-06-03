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

export default function DashboardPage() 
{
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
  <div className="dashboard-container">
    {/* Sidebar */}
    <aside className="sidebar">
      <div>
        <div className="logo">
          <h2>N</h2>
        </div>

        {role === "admin" ? (
          <>
            <div
              className="nav-item active"
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard size={20} />
            </div>

            <div
              className="nav-item"
              onClick={() => navigate("/create-form")}
            >
              <FilePlus size={20} />
            </div>

            <div
              className="nav-item"
              onClick={() => navigate("/forms")}
            >
              <FileText size={20} />
            </div>

            <div
              className="nav-item"
              onClick={() => navigate("/responses")}
            >
              <MessageSquare size={20} />
            </div>

            <div
              className="nav-item"
              onClick={() => navigate("/export")}
            >
              <Download size={20} />
            </div>
          </>
        ) : (
          <>
            <div
              className="nav-item active"
              onClick={() => navigate("/forms")}
            >
              <FileText size={20} />
            </div>

            <div
              className="nav-item"
              onClick={() => navigate("/submitted-forms")}
            >
              <BarChart3 size={20} />
            </div>
          </>
        )}
      </div>

      <button className="logout-btn" onClick={logout}>
        <LogOut size={18} />
      </button>
    </aside>

    <div className="dashboard-layout">
      <div className="dashboard-main">

        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <h1>
              {role === "admin"
                ? "Admin Dashboard"
                : "User Dashboard"}
            </h1>

            <p>{email}</p>
          </div>

          <div className="top-right">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search..."
              />
            </div>

            <Bell size={18} />

            <div className="profile-avatar">
              {email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* GLASS DASHBOARD */}
        <div className="glass-dashboard">

          {/* LEFT */}
          <div className="glass-left">

            <div className="glass-card activity-card">
              <h3>Feedback Activity</h3>

              <div className="activity-bars">
                <div className="bar" style={{height:"40%"}} />
                <div className="bar" style={{height:"75%"}} />
                <div className="bar" style={{height:"55%"}} />
                <div className="bar" style={{height:"90%"}} />
                <div className="bar" style={{height:"65%"}} />
                <div className="bar" style={{height:"80%"}} />
              </div>
            </div>

<div className="glass-card challenge-card">
  <h3>
    {role === "admin"
      ? "Quick Actions"
      : "My Actions"}
  </h3>

  {role === "admin" ? (
    <>
      <div className="challenge-item">
        <span>Create Form</span>
        <button onClick={() => navigate("/create-form")}>
          Open
        </button>
      </div>

      <div className="challenge-item">
        <span>Manage Forms</span>
        <button onClick={() => navigate("/forms")}>
          Open
        </button>
      </div>

      <div className="challenge-item">
        <span>Responses</span>
        <button onClick={() => navigate("/responses")}>
          Open
        </button>
      </div>

      <div className="challenge-item">
        <span>Export CSV</span>
        <button onClick={() => navigate("/export")}>
          Open
        </button>
      </div>
    </>
  ) : (
    <>
      <div className="challenge-item">
        <span>Fill Forms</span>
        <button onClick={() => navigate("/forms")}>
          Fill
        </button>
      </div>

      <div className="challenge-item">
        <span>Submitted Forms</span>
        <button
          onClick={() =>
            navigate("/submitted-forms")
          }
        >
          View
        </button>
      </div>
    </>
  )}
</div>
          </div>

          {/* CENTER */}
          <div className="glass-center">

            <div className="small-glass-card">
              <h4>
                {role === "admin"
                  ? "Total Forms"
                  : "Available Forms"}
              </h4>

              <h2>{stats.totalForms}</h2>
            </div>

            <div className="small-glass-card">
              <h4>
                {role === "admin"
                  ? "Total Feedbacks"
                  : "Submitted Forms"}
              </h4>

              <h2>{stats.totalFeedbacks}</h2>
            </div>

            {role === "admin" && (
              <div className="small-glass-card">
                <h4>Active Users</h4>
                <h2>{activeUsers}</h2>
              </div>
            )}

          </div>

          {/* RIGHT */}
          <div className="glass-right">

            <div className="glass-card profile-card">
              <div className="avatar-big">
                {email?.charAt(0).toUpperCase()}
              </div>

              <h3>{email?.split("@")[0]}</h3>

              <p>
                {role === "admin"
                  ? "Administrator"
                  : "User"}
              </p>
            </div>

            <div className="glass-card progress-card">
              <h3>Overview</h3>

              <div className="circle">
                <span>75%</span>
              </div>

              <p>Completion Rate</p>
            </div>

            {role === "admin" && (
              <div className="glass-card calendar-card">
                <h3>Recent Responses</h3>

                {recentResponses.length === 0 ? (
                  <p>No Responses</p>
                ) : (
                  recentResponses
                    .slice(0, 4)
                    .map((r) => (
                      <div
                        key={r.id}
                        className="response-row"
                      >
                        <strong>{r.name}</strong>

                        <span>
                          {r.formTitle}
                        </span>
                      </div>
                    ))
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  </div>
)
}
