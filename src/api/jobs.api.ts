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
  const res = await axiosClient.get<{ data: Job[]; meta: JobsMeta }>('/jobs/all', { params, signal });
  return { jobs: res.data.data, meta: res.data.meta };
};

/** Kept for backward-compat (DashboardPage client-side filtering) */
export const getAllJobs = async (signal?: AbortSignal): Promise<Job[]> => {
  const res = await axiosClient.get<{ data: Job[] }>('/jobs/all', { signal });
  return res.data.data;
};

export const getJobById = async (id: string, signal?: AbortSignal): Promise<Job> => {
  const res = await axiosClient.get<{ data: Job }>(`/jobs/${id}`, { signal });
  return res.data.data;
};

export const getRecruiterJobs = async (signal?: AbortSignal): Promise<Job[]> => {
  const res = await axiosClient.get<{ data: Job[] }>('/jobs/recruiter', { signal });
  return res.data.data;
};

export const createJob = async (data: JobFormData): Promise<Job> => {
  const res = await axiosClient.post<{ data: Job }>('/jobs', data);
  return res.data.data;
};

export const updateJob = async (id: string, data: Partial<JobFormData>): Promise<Job> => {
  const res = await axiosClient.put<{ data: Job }>(`/jobs/${id}`, data);
  return res.data.data;
};

export const deleteJob = async (id: string): Promise<void> => {
  await axiosClient.delete(`/jobs/${id}`);
};
