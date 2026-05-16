import axiosClient from './axiosClient';
import type {
  LoginRequest,
  JobSeekerSignupRequest,
  RecruiterSignupRequest,
  User,
} from '../types';

export const signupJobSeeker = async (data: JobSeekerSignupRequest): Promise<void> => {
  await axiosClient.post('/auth/signup/jobseeker', data);
};

export const signupRecruiter = async (data: RecruiterSignupRequest): Promise<void> => {
  await axiosClient.post('/auth/signup/recruiter', data);
};

export const login = async (data: LoginRequest): Promise<void> => {
  await axiosClient.post('/auth/login', data);
};

export const logout = async (): Promise<void> => {
  await axiosClient.post('/auth/logout');
};

export const getMe = async (signal?: AbortSignal): Promise<User> => {
  const { data: { user } } = await axiosClient.get<{ user: User }>('/auth/me', { signal });
  return user;
};

export const refreshToken = async (): Promise<void> => {
  // refreshToken cookie is sent automatically via withCredentials
  // backend sets a fresh accessToken cookie in the response
  await axiosClient.post('/auth/refresh');
};
