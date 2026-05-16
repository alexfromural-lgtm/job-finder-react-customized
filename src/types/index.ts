// ─── Enums ────────────────────────────────────────────────────────────────────

export type Role = 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN';

export type ApplicationStatus = 'submitted' | 'shortlisted' | 'rejected' | 'under_review';

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobSeekerProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  skills: string[];
  education?: string;
  experience?: string;
  resumeUrl?: string;
  /** Included by the backend in GET /jobseeker/profile responses */
  user?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  companyName: string;
  companyWebsite?: string;
  description?: string;
  industry?: string;
  /** Included by the backend in GET /recruiter/profile responses */
  user?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface Job {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salaryRange?: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  /** Partial recruiter info returned by the API (not the full RecruiterProfile) */
  recruiter?: {
    companyName: string;
    industry?: string;
    companyWebsite?: string;
  };
}

export interface Application {
  id: string;
  jobId: string;
  jobSeekerId: string;
  coverLetter?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  /** Populated by GET /jobseeker/applications */
  job?: {
    id: string;
    title: string;
    location: string;
    salaryRange?: string;
    category?: string;
    recruiter?: { companyName: string };
  };
}

export interface SavedJob {
  id: string;
  jobId: string;
  jobSeekerId: string;
  savedAt: string;
  /** Populated by GET /jobseeker/saved */
  job?: {
    id: string;
    title: string;
    location: string;
    salaryRange?: string;
    category?: string;
    isActive: boolean;
    recruiter?: { companyName: string };
  };
}

// ─── Queue ────────────────────────────────────────────────────────────────────

export type QueueJobStatus =
  | 'waiting'
  | 'active'
  | 'completed'
  | 'failed'
  | 'delayed'
  | 'paused';

export interface QueueJobResponse {
  id: string | number;
  type: string;
  status: QueueJobStatus;
  attemptsMade: number;
  createdAt: string;
  result?: unknown;
  failedReason?: string;
}

// ─── API Request/Response Types ───────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JobSeekerSignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface RecruiterSignupRequest {
  name: string;
  email: string;
  password: string;
  companyName: string;
  companyWebsite?: string;
  description?: string;
  industry?: string;
}

export interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  location: string;
  salaryRange?: string;
  category?: string;
}

// ─── API Wrapper ──────────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
}
