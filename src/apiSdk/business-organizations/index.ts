import axios from 'axios';
import queryString from 'query-string';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';
import { GetQueryInterface } from '../../interfaces';

export const getBusinessOrganizations = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/business-organizations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBusinessOrganization = async (businessOrganization: BusinessOrganizationInterface) => {
  const response = await axios.post('/api/business-organizations', businessOrganization);
  return response.data;
};

export const updateBusinessOrganizationById = async (
  id: string,
  businessOrganization: BusinessOrganizationInterface,
) => {
  const response = await axios.put(`/api/business-organizations/${id}`, businessOrganization);
  return response.data;
};

export const getBusinessOrganizationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/business-organizations/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteBusinessOrganizationById = async (id: string) => {
  const response = await axios.delete(`/api/business-organizations/${id}`);
  return response.data;
};
