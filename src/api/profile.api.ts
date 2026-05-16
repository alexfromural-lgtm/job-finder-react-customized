import axiosClient from './axiosClient';
import type { RecruiterProfile, JobSeekerProfile } from '../types';

// ─── Recruiter Profile ────────────────────────────────────────────────────────
// Response shape: { profile: RecruiterProfile }

export const getRecruiterProfile = async (signal?: AbortSignal): Promise<RecruiterProfile> => {
  const { data: { profile } } = await axiosClient.get<{ profile: RecruiterProfile }>('/recruiter/profile', { signal });
  return profile;
};

export const updateRecruiterProfile = async (
  data: Partial<Pick<RecruiterProfile, 'companyName' | 'companyWebsite' | 'description' | 'industry'>>
): Promise<RecruiterProfile> => {
  const { data: { profile } } = await axiosClient.patch<{ profile: RecruiterProfile }>('/recruiter/profile', data);
  return profile;
};

// ─── Job Seeker Profile ───────────────────────────────────────────────────────
// Response shape: { profile: JobSeekerProfile }

export const getJobSeekerProfile = async (signal?: AbortSignal): Promise<JobSeekerProfile> => {
  const { data: { profile } } = await axiosClient.get<{ profile: JobSeekerProfile }>('/jobseeker/profile', { signal });
  return profile;
};

export const updateJobSeekerProfile = async (
  data: Partial<Pick<JobSeekerProfile, 'bio' | 'location' | 'skills' | 'education' | 'experience' | 'resumeUrl'>>
): Promise<JobSeekerProfile> => {
  const { data: { profile } } = await axiosClient.patch<{ profile: JobSeekerProfile }>('/jobseeker/profile', data);
  return profile;
};
