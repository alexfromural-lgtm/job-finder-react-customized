import axiosClient from './axiosClient';
import type { Job, JobFormData } from '../types';

export interface JobSearchParams {
  search?: string;
  category?: string;
  location?: string;
  page?: number;
  pageSize?: number;
}

export interface JobsMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Server-side search + pagination — hits GET /api/jobs/all with query params */
export const searchJobs = async (
  params?: JobSearchParams,
  signal?: AbortSignal,
): Promise<{ jobs: Job[]; meta: JobsMeta }> => {
  const { data: { jobs, meta } } = await axiosClient.get<{ jobs: Job[]; meta: JobsMeta }>(
    '/jobs/all',
    { params, signal },
  );
  return { jobs, meta };
};

/** Kept for backward-compat (DashboardPage client-side filtering) */
export const getAllJobs = async (signal?: AbortSignal): Promise<Job[]> => {
  const { data: { jobs } } = await axiosClient.get<{ jobs: Job[] }>('/jobs/all', { signal });
  return jobs;
};

export const getJobById = async (id: string, signal?: AbortSignal): Promise<Job> => {
  const { data: { job } } = await axiosClient.get<{ job: Job }>(`/jobs/${id}`, { signal });
  return job;
};

export const getRecruiterJobs = async (signal?: AbortSignal): Promise<Job[]> => {
  const { data: { jobs } } = await axiosClient.get<{ jobs: Job[] }>('/jobs/recruiter', { signal });
  return jobs;
};

export const createJob = async (data: JobFormData): Promise<Job> => {
  const { data: { job } } = await axiosClient.post<{ job: Job }>('/jobs', data);
  return job;
};

export const updateJob = async (id: string, data: Partial<JobFormData>): Promise<Job> => {
  const { data: { job } } = await axiosClient.put<{ job: Job }>(`/jobs/${id}`, data);
  return job;
};

export const deleteJob = async (id: string): Promise<void> => {
  await axiosClient.delete(`/jobs/${id}`);
};
