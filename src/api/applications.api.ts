import axiosClient from './axiosClient';
import type { Application } from '../types';

export const applyToJob = async (
  jobId: string,
  coverLetter?: string,
): Promise<Application> => {
  const res = await axiosClient.post<{ application: Application }>(
    `/jobseeker/apply/${jobId}`,
    { coverLetter },
  );
  return res.data.application;
};

export const getMyApplications = async (): Promise<Application[]> => {
  const res = await axiosClient.get<{ data: Application[] }>('/jobseeker/applications');
  return res.data.data;
};

export const withdrawApplication = async (applicationId: string): Promise<void> => {
  await axiosClient.delete(`/jobseeker/applications/${applicationId}`);
};
