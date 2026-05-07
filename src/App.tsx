import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JobDetailPage from './pages/JobDetailPage';
import JobSeekerDashboard from './pages/jobseeker/DashboardPage';
import RecruiterDashboard from './pages/recruiter/DashboardPage';
import RecruiterProfilePage from './pages/recruiter/ProfilePage';
import JobSeekerProfilePage from './pages/jobseeker/ProfilePage';
import ApplicationsPage from './pages/jobseeker/ApplicationsPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        {/* Protected: Job Seeker */}
        <Route
          path="/dashboard/seeker"
          element={
            <ProtectedRoute requiredRole="JOB_SEEKER">
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected: Job Seeker Applications */}
        <Route
          path="/dashboard/seeker/applications"
          element={
            <ProtectedRoute requiredRole="JOB_SEEKER">
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: Recruiter */}
        <Route
          path="/dashboard/recruiter"
          element={
            <ProtectedRoute requiredRole="RECRUITER">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected: Recruiter Profile */}
        <Route
          path="/profile/recruiter"
          element={
            <ProtectedRoute requiredRole="RECRUITER">
              <RecruiterProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Protected: Job Seeker Profile */}
        <Route
          path="/profile/seeker"
          element={
            <ProtectedRoute requiredRole="JOB_SEEKER">
              <JobSeekerProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
