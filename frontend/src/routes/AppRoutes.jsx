import { Routes, Route } from "react-router-dom";

// AUTH
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

// DASHBOARD
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";

// FORMS
import FormsPage from "../pages/FormsPage";
import CreateFormPage from "../pages/CreateFormPage";

// FORM VIEW (ADMIN)
import AdminFormViewPage from "../pages/AdminFormViewPage";

// FEEDBACK (USER SUBMIT PAGE)
import FeedbackPage from "../pages/FeedbackPage";

// RESPONSES
import ResponsesPage from "../pages/ResponsesPage";
import FormResponsesPage from "../pages/FormResponsesPage";

// ADMIN
import AdminFeedbackDetailsPage from "../pages/AdminFeedbackDetailsPage";
import SubmittedFormsPage from "../pages/SubmittedFormsPage";
import ExportPage from "../pages/ExportPage";


export default function AppRoutes({ theme, toggleTheme }) {
  return (
    <Routes>

      {/* ================= AUTH ================= */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* ================= DASHBOARD ================= */}
      <Route
        path="/dashboard"
        element={
          <DashboardPage theme={theme} toggleTheme={toggleTheme} />
        }
      />
      <Route path="/profile" element={<ProfilePage />} />

      {/* ================= FORMS ================= */}
      <Route path="/forms" element={<FormsPage />} />
      <Route path="/create-form" element={<CreateFormPage />} />
      <Route path="/edit-form/:id" element={<CreateFormPage />} />

      {/* ================= FORM VIEW (SINGLE REUSE PAGE) ================= */}
      <Route path="/forms/:id" element={<AdminFormViewPage />} />

      <Route
        path="/admin/forms/view/:id"
        element={<AdminFormViewPage />}
      />

      {/* ================= FEEDBACK SUBMIT ================= */}
      <Route path="/feedback/:id" element={<FeedbackPage />} />

      {/* ================= RESPONSES ================= */}
      <Route path="/responses" element={<ResponsesPage />} />

      {/* ================= ADMIN FEEDBACK DETAILS ================= */}
      <Route
        path="/admin-feedbacks/:formId"
        element={<AdminFeedbackDetailsPage />}
      />

      <Route
        path="/admin-feedbacks/:formId/responses"
        element={<FormResponsesPage />}
      />

      {/* ================= OTHER ================= */}
      <Route
        path="/submitted-forms"
        element={<SubmittedFormsPage />} />

      <Route path="/export" element={<ExportPage />} />
  

    </Routes>
  );
}