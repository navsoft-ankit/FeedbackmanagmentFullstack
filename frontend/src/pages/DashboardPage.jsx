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

  const name = localStorage.getItem("name");


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
  const [totalUsers, setTotalUsers] = useState(0);
  const [submittedUsers, setSubmittedUsers] = useState(0);

  const [showProfile, setShowProfile] = useState(false);
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [forms, setForms] = useState([]);
  const [activity, setActivity] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);


  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const navigate = useNavigate();

  const goProfile = () => {
    navigate("/Profile");
  };

const logout = () => {
  localStorage.removeItem("token");

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
        const [statsRes, usersRes, totalUsersRes] = await Promise.all([
          api.get("/dashboard/stats?ts=" + new Date().getTime()),
          api.get("/auth/active-users-count"),
          api.get("/auth/total-users")
        ]);

        setStats({
          totalForms: statsRes.data.totalForms,
          totalFeedbacks: statsRes.data.totalFeedbacks,
        });

        setActiveUsers(usersRes.data.activeUsers || 0);
        setTotalUsers(totalUsersRes.data.totalUsers || 0);

        setSubmittedUsers(statsRes.data.totalFeedbacks || 0);
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
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setFeedbacks(sorted);
      setRecentResponses(sorted.slice(0, 5));
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

  // =========================
  // UNIQUE USERS (ADMIN)
  // =========================
  const uniqueUsers = new Set(
    feedbacks.map((f) => f.email)
  ).size;

  // =========================
  // UNIQUE SUBMITTED FORMS
  // =========================
  const uniqueSubmittedForms = new Set(
    feedbacks.map((f) => f.formId)
  ).size;

  // =========================
  // ADMIN CIRCLE (ENGAGEMENT)
  // =========================
  const totalForms = stats.totalForms || 0;
  const totalResponses = stats.totalFeedbacks || 0;

  // total admin metric (utilization style)
  const adminTotalKPI =
    totalForms > 0
      ? Math.min(
        Math.round((totalResponses / totalForms) * 10),
        100
      )
      : 0;
  // =========================
  // USER CIRCLE (COMPLETION)
  // FIX: better + correct logic
  // =========================
  const available = stats.totalForms || 0;
  const submitted = stats.totalFeedbacks || 0;

  const totalFormsAll = available + submitted;

  const userCircleValue =
    totalFormsAll > 0
      ? Math.round((submitted / totalFormsAll) * 100)
      : 0;
  // =========================
  // FINAL VALUE (ROLE BASED)
  // =========================
  const completionRate =
    role === "admin"
      ? adminTotalKPI
      : userCircleValue;
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="logo">
            <h2>Voxify</h2>
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
                          onClick={() => navigate(`/admin/forms/view/${form.id}`)}
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
                  onClick={goProfile}
                  style={{ cursor: "pointer" }}
                >
                  {name?.charAt(0).toUpperCase()}
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
                  {(() => {
                    const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

                    const sortedActivity = [...(activity || [])].sort(
                      (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
                    );

                    const max = Math.max(
                      ...sortedActivity.map(a => a.count || 0),
                      1
                    );

                    return sortedActivity.map((item, index) => {
                      const height = (item.count / max) * 100;

                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <div
                            className="bar"
                            style={{ height: `${height}%` }}
                            title={`${item.day}: ${item.count}`}
                          />

                          <span className="bar-label">{item.day}</span>
                        </div>
                      );
                    });
                  })()}
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
                        Create
                      </button>
                    </div>

                    <div className="challenge-item">
                      <span>Manage Forms</span>
                      <button onClick={() => navigate("/forms")}>
                        Manage
                      </button>
                    </div>

                    <div className="challenge-item">
                      <span>Responses</span>
                      <button onClick={() => navigate("/responses")}>
                        Response
                      </button>
                    </div>

                    <div className="challenge-item">
                      <span>Export CSV</span>
                      <button onClick={() => navigate("/export")}>
                        Csv
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
                <h4>{role === "admin" ? "Total Forms" : "Available Forms"}</h4>
                <h2>{stats.totalForms}</h2>
              </div>

              <div className="small-glass-card">
                <h4>{role === "admin" ? "Total Feedbacks" : "Submitted Forms"}</h4>
                <h2>{stats.totalFeedbacks}</h2>
              </div>

              {role === "admin" && (
                <div className="small-glass-card">
                  <h4>Active Users</h4>
                  <h2>{activeUsers}</h2>
                </div>
              )}

              {/* ADD IT HERE (THIS FIXES EVERYTHING) */}
              <div className="glass-card trend-card">
                <h3>Feedback Insights</h3>

                {(() => {
                  const today = new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                  });

                  // normalize day format (Mon, Tue etc)
                  const normalizeDay = (d) => d.slice(0, 3);

                  const todayData = activity.find(
                    (a) => normalizeDay(a.day) === today
                  );

                  const todayCount = todayData?.count || 0;

                  const total = activity.reduce(
                    (sum, a) => sum + (a.count || 0),
                    0
                  );

                  const avg = activity.length
                    ? Math.round(total / activity.length)
                    : 0;

                  const peak = activity.reduce(
                    (max, a) =>
                      (a.count || 0) > (max.count || 0) ? a : max,
                    activity[0] || { day: "-", count: 0 }
                  );

                  return (
                    <div className="trend-metrics">

                      {/* TODAY */}
                      <div className="trend-item">
                        <span>Today Submit</span>
                        <strong>{todayCount}</strong>
                      </div>

                      {/* AVERAGE */}
                      <div className="trend-item">
                        <span>Avg per day</span>
                        <strong>{avg}</strong>
                      </div>

                      {/* PEAK */}
                      <div className="trend-item">
                        <span>Peak Form</span>
                        <strong>
                          {peak.day} ({peak.count})
                        </strong>
                      </div>

                    </div>
                  );
                })()}
              </div>

            </div>

            {/* RIGHT */}
            <div className="glass-right">

              <div className="glass-card profile-card">
                <div className="avatar-big">
                  {name?.charAt(0).toUpperCase()}
                </div>

                <h3>{name}</h3>

                <p>{email}</p>

                <span className="role-badge">
                  {role}
                </span>
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
                    : "Your form completion"}
                </p>

                <p>Completion Rate</p>
              </div>

              {role === "admin" && (
                <div className="glass-card calendar-card">
                  <h3>Recent Responses</h3>

                  <div className="recent-scroll">
                    {recentResponses.length === 0 ? (
                      <p>No Responses</p>
                    ) : (
                      recentResponses.map((r) => (
                        <div key={r.id} className="response-row">
                          <strong>{r.name}</strong>
                          <span>{r.formTitle}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}