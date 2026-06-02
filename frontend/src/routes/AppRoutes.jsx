import { Routes, Route } from "react-router-dom";

// AUTH
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

// DASHBOARD
import DashboardPage from "../pages/DashboardPage";

// FORMS
import FormsPage from "../pages/FormsPage";
import CreateFormPage from "../pages/CreateFormPage";
import AdminFormViewPage from "../pages/AdminFormViewPage";

// FEEDBACK
import FeedbackPage from "../pages/FeedbackPage";
import ResponsesPage from "../pages/ResponsesPage";

// ADMIN
import AdminFeedbackDetailsPage from "../pages/AdminFeedbackDetailsPage";
import SubmittedFormsPage from "../pages/SubmittedFormsPage";
import ExportPage from "../pages/ExportPage";

export default function AppRoutes({ theme, toggleTheme }) {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={<DashboardPage theme={theme} toggleTheme={toggleTheme} />}
      />

      {/* FORMS */}
      <Route path="/forms" element={<FormsPage />} />
      <Route path="/create-form" element={<CreateFormPage />} />
      <Route path="/edit-form/:id" element={<CreateFormPage />} />
      <Route path="/admin/forms/view/:id" element={<AdminFormViewPage />} />

      {/* FEEDBACK */}
      <Route path="/feedback/:id" element={<FeedbackPage />} />
      <Route path="/responses" element={<ResponsesPage />} />

      {/* ADMIN FEEDBACK DETAILS */}
      <Route
        path="/admin-feedbacks/:formId"
        element={<AdminFeedbackDetailsPage />}
      />

      {/* SUBMITTED FORMS & EXPORT */}
      <Route path="/submitted-forms" element={<SubmittedFormsPage />} />
      <Route path="/export" element={<ExportPage />} />
    </Routes>
  );
}