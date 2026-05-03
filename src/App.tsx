import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JobDetailPage from './pages/JobDetailPage';
import JobSeekerDashboard from './pages/jobseeker/DashboardPage';
import RecruiterDashboard from './pages/recruiter/DashboardPage';

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

        {/* Protected: Recruiter */}
        <Route
          path="/dashboard/recruiter"
          element={
            <ProtectedRoute requiredRole="RECRUITER">
              <RecruiterDashboard />
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
