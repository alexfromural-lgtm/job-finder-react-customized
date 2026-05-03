import axiosClient from './axiosClient';
import type { Job, JobFormData } from '../types';

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
