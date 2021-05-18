import { jsonPost } from './index';

export const register = async (email, password) => {
  const url = '/api/auth/register';
  const result = await jsonPost(url, { email, password });

  return result;
};

export const login = async (email, password) => {
  const url = '/api/auth/login';
  const result = await jsonPost(url, { email, password });

  return result;
};

export const refreshAccessToken = async (refreshToken) => {
  const url = '/api/auth/refresh';
  const result = await jsonPost(url, { refresh_token: refreshToken });

  return result;
};
