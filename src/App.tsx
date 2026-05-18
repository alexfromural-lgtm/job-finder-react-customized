import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JobDetailPage from './pages/JobDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import JobSeekerDashboard from './pages/jobseeker/DashboardPage';
import RecruiterDashboard from './pages/recruiter/DashboardPage';
import RecruiterProfilePage from './pages/recruiter/ProfilePage';
import JobSeekerProfilePage from './pages/jobseeker/ProfilePage';
import ApplicationsPage from './pages/jobseeker/ApplicationsPage';
import SavedJobsPage from './pages/jobseeker/SavedJobsPage';

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

        {/* Protected: Job Seeker Saved Jobs */}
        <Route
          path="/dashboard/seeker/saved"
          element={
            <ProtectedRoute requiredRole="JOB_SEEKER">
              <SavedJobsPage />
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

        {/* Catch-all — proper 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
