import axiosClient from './axiosClient';
import type { Application, SavedJob } from '../types';

// ─── Queued response shape (202 Accepted) ─────────────────────────────────────

export interface QueuedResponse {
  queueJobId: string | number;
  status: 'queued';
}

// ─── Apply to Job (queued — returns 202) ─────────────────────────────────────

/**
 * POST /api/jobseeker/apply/:jobId
 *
 * The backend processes this asynchronously through a message queue.
 * Returns a queue job ID immediately (202 Accepted). Use pollUntilDone()
 * from queue.api.ts to wait for the actual result.
 */
export const applyToJob = async (
  jobId: string,
  coverLetter?: string,
): Promise<QueuedResponse> => {
  const { data } = await axiosClient.post<QueuedResponse>(
    `/jobseeker/apply/${jobId}`,
    { coverLetter },
  );
  return data;
};

// ─── Saved Jobs (reads) ───────────────────────────────────────────────────────

export const getSavedJobs = async (signal?: AbortSignal): Promise<SavedJob[]> => {
  const { data: { savedJobs } } = await axiosClient.get<{ savedJobs: SavedJob[] }>('/jobseeker/saved', { signal });
  return savedJobs;
};

// ─── Save / Unsave Job (save is queued — returns 202) ────────────────────────

/**
 * POST /api/jobseeker/saved/:jobId
 *
 * The backend processes saves asynchronously. Returns a queue job ID (202).
 * Use pollUntilDone() from queue.api.ts to confirm the save completed.
 */
export const saveJob = async (jobId: string): Promise<QueuedResponse> => {
  const { data } = await axiosClient.post<QueuedResponse>(`/jobseeker/saved/${jobId}`);
  return data;
};

export const unsaveJob = async (jobId: string): Promise<void> => {
  await axiosClient.delete(`/jobseeker/saved/${jobId}`);
};

// ─── My Applications (synchronous reads) ─────────────────────────────────────

export const getMyApplications = async (signal?: AbortSignal): Promise<Application[]> => {
  const { data: { applications } } = await axiosClient.get<{ applications: Application[] }>('/jobseeker/applications', { signal });
  return applications;
};

export const withdrawApplication = async (applicationId: string): Promise<void> => {
  await axiosClient.delete(`/jobseeker/applications/${applicationId}`);
};
