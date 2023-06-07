import axios from 'axios';
import queryString from 'query-string';
import { JobApplicationInterface } from 'interfaces/job-application';
import { GetQueryInterface } from '../../interfaces';

export const getJobApplications = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/job-applications${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createJobApplication = async (jobApplication: JobApplicationInterface) => {
  const response = await axios.post('/api/job-applications', jobApplication);
  return response.data;
};

export const updateJobApplicationById = async (id: string, jobApplication: JobApplicationInterface) => {
  const response = await axios.put(`/api/job-applications/${id}`, jobApplication);
  return response.data;
};

export const getJobApplicationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/job-applications/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteJobApplicationById = async (id: string) => {
  const response = await axios.delete(`/api/job-applications/${id}`);
  return response.data;
};
