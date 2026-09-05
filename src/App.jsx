import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/RouteGuards';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import UserDashboard from './pages/user/UserDashboard';
import TakeQuizPage from './pages/user/TakeQuizPage';
import QuizResultPage from './pages/user/QuizResultPage';
import MyScoresPage from './pages/user/MyScoresPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import QuizEditorPage from './pages/admin/QuizEditorPage';

function HomeRedirect() {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* USER routes */}
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/quiz/:id/take" element={<ProtectedRoute><TakeQuizPage /></ProtectedRoute>} />
        <Route path="/quiz/:id/result" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
        <Route path="/my-scores" element={<ProtectedRoute><MyScoresPage /></ProtectedRoute>} />

        {/* ADMIN routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/quiz/new" element={<AdminRoute><QuizEditorPage /></AdminRoute>} />
        <Route path="/admin/quiz/:id/edit" element={<AdminRoute><QuizEditorPage /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
