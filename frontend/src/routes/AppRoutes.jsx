import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import FormsPage from "../pages/FormsPage";
import CreateFormPage from "../pages/CreateFormPage";
import FeedbackPage from "../pages/FeedbackPage";
import ExportPage from "../pages/ExportPage";
import SubmittedFormsPage from "../pages/SubmittedFormsPage";
import AdminFeedbackDetailsPage from "../pages/AdminFeedbackDetailsPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

export default function AppRoutes({ theme, toggleTheme }) {
  return (
    <Routes>

      {/* AUTH */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <DashboardPage
            theme={theme}
            toggleTheme={toggleTheme}
          />
        }
      />

      {/* FORMS */}
      <Route path="/forms" element={<FormsPage />} />

      <Route
        path="/create-form"
        element={<CreateFormPage />}
      />

      {/* FEEDBACK */}
      <Route
        path="/feedback/:id"
        element={<FeedbackPage />}
      />

      {/* EXPORT */}
      <Route path="/export" element={<ExportPage />} />

      <Route
        path="/submitted-forms"
        element={<SubmittedFormsPage />}
      />

      <Route
        path="/admin-feedbacks/:formId"
        element={<AdminFeedbackDetailsPage />}
      />

      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />
    </Routes>
  );
}