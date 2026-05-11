import axiosClient from './axiosClient';
import type { Application } from '../types';

// ─── Queued response shape (202 Accepted) ─────────────────────────────────────

export interface QueuedResponse {
  jobId: string | number;
  status: 'queued';
}

// ─── Apply to Job (queued — returns 202) ─────────────────────────────────────

/**
 * POST /api/jobseeker/apply/:jobId
 *
 * The backend now processes this asynchronously through a message queue.
 * Returns a queue job ID immediately (202 Accepted). Use pollUntilDone()
 * from queue.api.ts to wait for the actual result.
 */
export const applyToJob = async (
  jobId: string,
  coverLetter?: string,
): Promise<QueuedResponse> => {
  const res = await axiosClient.post<QueuedResponse>(
    `/jobseeker/apply/${jobId}`,
    { coverLetter },
  );
  return res.data;
};

// ─── Save / Unsave Job (save is queued — returns 202) ────────────────────────

/**
 * POST /api/jobseeker/save/:jobId
 *
 * The backend processes saves asynchronously. Returns a queue job ID (202).
 * Use pollUntilDone() from queue.api.ts to confirm the save completed.
 */
export const saveJob = async (jobId: string): Promise<QueuedResponse> => {
  const res = await axiosClient.post<QueuedResponse>(`/jobseeker/save/${jobId}`);
  return res.data;
};

export const unsaveJob = async (jobId: string): Promise<void> => {
  await axiosClient.delete(`/jobseeker/save/${jobId}`);
};

// ─── My Applications (synchronous reads) ─────────────────────────────────────

export const getMyApplications = async (): Promise<Application[]> => {
  const res = await axiosClient.get<{ data: Application[] }>('/jobseeker/applications');
  return res.data.data;
};

export const withdrawApplication = async (applicationId: string): Promise<void> => {
  await axiosClient.delete(`/jobseeker/applications/${applicationId}`);
};
