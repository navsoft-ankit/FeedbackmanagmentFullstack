import { useEffect, useState } from "react";
import { useRef } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [forms, setForms] = useState([]);
  const [activity, setActivity] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);


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
    if (!email || !role) return;

    const load = async () => {
      await fetchStats();
      await fetchForms();
      await fetchActivity();

      if (role === "admin") {
        await fetchFeedbacks();
      }
    };

    load();

    const interval = setInterval(() => {
      load(); // always fresh call
    }, 5000); // 10s না, test এর জন্য 5s

    return () => clearInterval(interval);
  }, [email, role]);

  const fetchForms = async () => {
    try {
      const res = await api.get("/forms/all-public");

      console.log("Forms API Response:", res);
      console.log("Forms API Data:", res.data);

      setForms(res.data);
    } catch (err) {
      console.error("Fetch forms error:", err);
    }
  };

  const fetchStats = async () => {
    try {
      if (role === "admin") {
        const [statsRes, usersRes] = await Promise.all([
          api.get("/dashboard/stats?ts=" + new Date().getTime()),

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

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get("/feedback/all");

      setFeedbacks(res.data);
      setRecentResponses(res.data.slice(0, 5)); // ADD THIS
    } catch (err) {
      console.error("Fetch feedbacks error:", err);
    }
  };
  const fetchActivity = async () => {
    try {
      const res = await api.get("/dashboard/feedback-activity");
      console.log("ACTIVITY API RESPONSE:", res.data);
      setActivity(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const filteredForms = forms.filter((form) =>
    (form.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  console.log("Forms:", forms);

  // =========================
  // USER COMPLETION RATE
  // =========================
  const uniqueSubmittedForms = new Set(
    feedbacks.map((f) => f.formId)
  ).size;

  const userCompletionRate =
    stats.totalForms > 0
      ? Math.min(
        100,
        Math.round((uniqueSubmittedForms / stats.totalForms) * 100)
      )
      : 0;
  // =========================
  // ADMIN COMPLETION RATE (FIXED)
  // =========================

  // unique users who submitted at least 1 form
  const uniqueUsers = new Set(
    feedbacks.map((f) => f.email)
  ).size;

  // safe division
  const adminCompletionRate =
    activeUsers > 0
      ? Math.min(
        100,
        Math.round((uniqueUsers / activeUsers) * 100)
      )
      : 0;

  const completionRate =
    role === "admin" ? adminCompletionRate : userCompletionRate;
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

              {/* Search Box */}
              <div className="search-container">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search forms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {searchTerm && (
                  <div className="search-results">
                    {filteredForms.length > 0 ? (
                      filteredForms.slice(0, 5).map((form) => (
                        <div
                          key={form.id}
                          className="search-item"
                          onClick={() => navigate("/forms")}
                        >
                          {form.title}
                        </div>
                      ))
                    ) : (
                      <div className="search-item">
                        No forms found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Bell size={18} />

              {/* Avatar */}
              <div className="profile-wrapper">
                <div
                  className="profile-avatar"
                  onClick={toggleProfile}
                  style={{ cursor: "pointer" }}
                >
                  {email?.charAt(0).toUpperCase()}
                </div>

                {showProfile && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="avatar-big">
                        {email?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h4>{email?.split("@")[0]}</h4>
                        <p>{email}</p>
                      </div>
                    </div>

                    <div className="profile-role">
                      {role === "admin"
                        ? "Administrator"
                        : "User"}
                    </div>

                    <button
                      className="profile-logout"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </div>
                )}
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
                  {(activity || []).length > 0 &&
                    activity.map((item, index) => {

                      const max = Math.max(
                        ...activity.map(a => a.count || 0),
                        1
                      );

                      const height = (item.count / max) * 100;

                      return (
                        <div
                          key={index}
                          className="bar"
                          style={{ height: `${height}%` }}
                          title={`${item.day}: ${item.count}`}
                        />
                      );
                    })}
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

                <div
                  className="progress-ring"
                  style={{ "--percent": completionRate }}
                >
                  <div className="progress-inner">
                    <span>{completionRate}%</span>
                  </div>
                </div>

                <p>
                  {role === "admin"
                    ? "Users who submitted forms"
                    : "Your Completion Rate"}
                </p>

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
