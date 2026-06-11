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
  const profilePhoto = localStorage.getItem(`idCardPhoto_${email}`
  );

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
  const [openFAQ, setOpenFAQ] = useState(null);


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

  // ================= UNIQUE USERS (ADMIN) =================
  const uniqueUsers = new Set(
    feedbacks.map((f) => f.email)
  ).size;

  // ================= UNIQUE SUBMITTED FORMS =================
  const uniqueSubmittedForms = new Set(
    feedbacks.map((f) => f.formId)
  ).size;

  // ================= ADMIN CIRCLE (ENGAGEMENT) =================
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

  // ================= USER CIRCLE (COMPLETION) || FIX: better + correct logic =================
  const available = stats.totalForms || 0;
  const submitted = stats.totalFeedbacks || 0;

  const totalFormsAll = available + submitted;

  const userCircleValue =
    totalFormsAll > 0
      ? Math.round((submitted / totalFormsAll) * 100)
      : 0;

  // ================= FINAL VALUE (ROLE BASED) =================
  const completionRate =
    role === "admin"
      ? adminTotalKPI
      : userCircleValue;

  const faqs = [
    {
      question: "Can I create different feedback forms for different departments or events?",
      answer:
        "Yes. Voxify allows administrators to create multiple custom feedback forms tailored to specific departments, events, workshops, courses, or customer experiences."
    },
    {
      question: "How can I distribute feedback forms to users?",
      answer:
        "Forms can be shared through direct links, QR codes, email invitations, or embedded within your organization's website."
    },
    {
      question: "Is it possible to customize the feedback questions and branding?",
      answer:
        "Absolutely. You can customize form colors, logos, titles, descriptions, and questions to match your organization's identity."
    },
    {
      question: "Can I track feedback in real time?",
      answer:
        "Yes. Voxify provides real-time analytics and reporting dashboards that update instantly when users submit feedback."
    },
    {
      question: "Does Voxify support data export?",
      answer:
        "Yes. Administrators can export feedback data and reports in CSV format for further analysis and record keeping."
    }
  ];

  console.log(stats);
console.log(activeUsers);
console.log(totalUsers);
console.log(uniqueUsers);
console.log(uniqueSubmittedForms);
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <header className="dashboard-navbar">

        <div className="nav-left">
          <h2 className="nav-logo">Voxify</h2>

          {role === "admin" ? (
            <>
              {/* <button onClick={() => navigate("/dashboard")}>
                Dashboard
              </button> */}

              <button onClick={() => navigate("/create-form")}>
                Create Form
              </button>

              <button onClick={() => navigate("/forms")}>
                Forms
              </button>

              <button onClick={() => navigate("/responses")}>
                Responses
              </button>

              <button onClick={() => navigate("/export")}>
                Export
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/forms")}>
                Forms
              </button>

              <button onClick={() => navigate("/submitted-forms")}>
                Submitted
              </button>
            </>
          )}
        </div>

        <div className="nav-right">
          <button className="book-demo-btn" onClick={goProfile}>
            Profile
          </button>

          <button className="logout-btn-top" onClick={logout}>
            Logout
          </button>
        </div>

      </header>

      <div className="dashboard-layout">
        <div className="dashboard-main">

          {/* GLASS DASHBOARD */}
          <div className="modern-dashboard">

            <section className="hero-section">
              <div className="hero-left">
                <h1>
                  Collect Actionable Feedback
                  <br />
                  With Smart Voxify Forms
                </h1>

                <p>
                  Create, distribute and analyze feedback forms
                  with powerful real-time insights and reporting.
                </p>

                <button
                  className="hero-btn"
                  onClick={() => navigate("/create-form")}
                >
                  Create Form
                </button>
              </div>

              <div className="hero-right">
                <img
                  src="image copy.png"
                  alt="Feedback"
                />
              </div>
            </section>

            <section className="stats-grid">

              <div className="stat-card">
                <h4>Total Forms</h4>
                <h2>{stats.totalForms}</h2>
              </div>

              <div className="stat-card">
                <h4>Total Feedbacks</h4>
                <h2>{stats.totalFeedbacks}</h2>
              </div>

              <div className="stat-card">
                <h4>Active Users</h4>
                <h2>{activeUsers}</h2>
              </div>

              <div className="stat-card">
                <h4>Total Users</h4>
                <h2>{totalUsers}</h2>
              </div>

              <div className="stat-card">
                <h4>Unique Submitters</h4>
                <h2>{uniqueUsers}</h2>
              </div>

              <div className="stat-card">
                <h4>Submitted Forms</h4>
                <h2>{uniqueSubmittedForms}</h2>
              </div>
            </section>

            <section className="features-section">
  <div className="features-header">
    <h2>
      Capture Insights That Shape Better
      <br />
      Experiences
    </h2>

    <p>
      Collect structured feedback, analyze responses,
      and improve decision making with Voxify's
      powerful feedback management platform.
    </p>
  </div>

  <div className="features-grid">

    <div className="feature-card">
      <div className="feature-icon">📝</div>

      <h3>Smart Form Creation</h3>

      <p>
        Create custom feedback forms for events,
        courses, products and services in minutes.
      </p>
    </div>

    <div className="feature-card">
      <div className="feature-icon">📊</div>

      <h3>Real-Time Analytics</h3>

      <p>
        Monitor responses instantly with visual
        insights and reporting dashboards.
      </p>
    </div>

    <div className="feature-card">
      <div className="feature-icon">⚙️</div>

      <h3>Customizable Fields</h3>

      <p>
        Add ratings, text answers, multiple choice
        questions and more to collect rich feedback.
      </p>
    </div>

  </div>
</section>

            <section className="faq-section">
              <h2>FAQs - Feedback Manager</h2>

              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <div
                    className="faq-question"
                    onClick={() =>
                      setOpenFAQ(
                        openFAQ === index ? null : index
                      )
                    }
                  >
                    <span>
                      {index + 1}. {faq.question}
                    </span>

                    <div className="faq-icon">
                      {openFAQ === index ? "−" : "+"}
                    </div>
                  </div>

                  {openFAQ === index && (
                    <div className="faq-answer">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </section>
<footer className="dashboard-footer">
  <div className="footer-content">

    <div className="footer-brand">
      <h1>Voxify</h1>
      <p>
        Smart feedback collection platform that helps
        organizations gather, analyze and improve
        customer and employee experiences.
      </p>
    </div>

    <div className="footer-links">
      <h3>Product</h3>
      <a href="/create-form">Forms</a>
      <a href="/responses">Analytics</a>
      <a href="/export">Export</a>
    </div>

    <div className="footer-links">
      <h3>Resources</h3>
      <a href="#">Help Center</a>
      <a href="#">Documentation</a>
      <a href="#">FAQs</a>
      <a href="#">Support</a>
    </div>

    <div className="footer-links">
      <h3>Contact</h3>
      <p>support@voxify.com</p>
      <p>+91 XXXXX XXXXX</p>
      <p>Kolkata, India</p>
    </div>

  </div>

  <div className="footer-bottom">
    © 2026 Voxify. All rights reserved.
  </div>
</footer>

          </div>
        </div>
      </div>
    </div>
  )
}