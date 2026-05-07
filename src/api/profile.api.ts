import axiosClient from './axiosClient';
import type { RecruiterProfile, JobSeekerProfile } from '../types';

// ─── Recruiter Profile ────────────────────────────────────────────────────────
// Response shape: { data: RecruiterProfile }

export const getRecruiterProfile = async (signal?: AbortSignal): Promise<RecruiterProfile> => {
  const res = await axiosClient.get<{ data: RecruiterProfile }>('/recruiter/profile', { signal });
  return res.data.data;
};

export const updateRecruiterProfile = async (
  data: Partial<Pick<RecruiterProfile, 'companyName' | 'companyWebsite' | 'description' | 'industry'>>
): Promise<RecruiterProfile> => {
  const res = await axiosClient.patch<{ data: RecruiterProfile }>('/recruiter/profile', data);
  return res.data.data;
};

// ─── Job Seeker Profile ───────────────────────────────────────────────────────
// Response shape: { profile: JobSeekerProfile }

export const getJobSeekerProfile = async (signal?: AbortSignal): Promise<JobSeekerProfile> => {
  const res = await axiosClient.get<{ profile: JobSeekerProfile }>('/jobseeker/profile', { signal });
  return res.data.profile;
};

export const updateJobSeekerProfile = async (
  data: Partial<Pick<JobSeekerProfile, 'bio' | 'location' | 'skills' | 'education' | 'experience' | 'resumeUrl'>>
): Promise<JobSeekerProfile> => {
  const res = await axiosClient.patch<{ profile: JobSeekerProfile }>('/jobseeker/profile', data);
  return res.data.profile;
};
