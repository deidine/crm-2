import axios from 'axios';

const API_BASE_URL = '/api/employers';

export const fetchEmployers = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const createEmployer = async (data) => {
  const response = await axios.post(API_BASE_URL, data);
  return response.data;
};

export const updateEmployer = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteEmployer = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
