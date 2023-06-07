import axios from 'axios';
import queryString from 'query-string';
import { IntegrationInterface } from 'interfaces/integration';
import { GetQueryInterface } from '../../interfaces';

export const getIntegrations = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/integrations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createIntegration = async (integration: IntegrationInterface) => {
  const response = await axios.post('/api/integrations', integration);
  return response.data;
};

export const updateIntegrationById = async (id: string, integration: IntegrationInterface) => {
  const response = await axios.put(`/api/integrations/${id}`, integration);
  return response.data;
};

export const getIntegrationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/integrations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteIntegrationById = async (id: string) => {
  const response = await axios.delete(`/api/integrations/${id}`);
  return response.data;
};
