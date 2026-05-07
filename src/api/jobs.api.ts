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
): Promise<{ jobs: Job[]; meta: JobsMeta }> => {
  const res = await axiosClient.get<{ data: Job[]; meta: JobsMeta }>('/jobs/all', { params });
  return { jobs: res.data.data, meta: res.data.meta };
};

/** Kept for backward-compat (DashboardPage client-side filtering) */
export const getAllJobs = async (): Promise<Job[]> => {
  const res = await axiosClient.get<{ data: Job[] }>('/jobs/all');
  return res.data.data;
};

export const getJobById = async (id: string): Promise<Job> => {
  const res = await axiosClient.get<{ data: Job }>(`/jobs/${id}`);
  return res.data.data;
};

export const getRecruiterJobs = async (): Promise<Job[]> => {
  const res = await axiosClient.get<{ data: Job[] }>('/jobs/recruiter');
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
