import axios from 'axios';

export function setupAPIClient() {
  const token = localStorage.getItem('JWT') || '';

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASEURL,
  });

  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return api;
}

