import axiosClient from './axiosClient';
import type {
  AuthResponse,
  LoginRequest,
  JobSeekerSignupRequest,
  RecruiterSignupRequest,
  User,
} from '../types';

export const signupJobSeeker = async (data: JobSeekerSignupRequest): Promise<AuthResponse> => {
  const res = await axiosClient.post<AuthResponse>('/auth/signup/jobseeker', data);
  return res.data;
};

export const signupRecruiter = async (data: RecruiterSignupRequest): Promise<AuthResponse> => {
  const res = await axiosClient.post<AuthResponse>('/auth/signup/recruiter', data);
  return res.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await axiosClient.post<AuthResponse>('/auth/login', data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await axiosClient.post('/auth/logout');
};

export const getMe = async (signal?: AbortSignal): Promise<User> => {
  const res = await axiosClient.get<{ user: User }>('/auth/me', { signal });
  return res.data.user;
};
