import store from '../store';

const host = process.env.VUE_APP_API_URI;

export const jsonPost = async (url, requestPayload) => {
  const response = await fetch(host + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestPayload),
  });

  const data = await response.json();

  return data;
};

export const jsonAuthGet = async (url) => {
  const token = store?.state?.auth?.accessToken;

  if (!token) {
    return { message: 'You are not authenticated' };
  }

  const response = await fetch(host + url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data;
};

export const jsonGet = async (url) => {
  const response = await fetch(host + url, {
    method: 'GET',
  });

  const data = await response.json();

  return data;
};

export const jsonAuthPost = async (url, requestPayload) => {
  const token = store?.state?.auth?.accessToken;

  if (!token) {
    return { message: 'You are not authenticated' };
  }

  const response = await fetch(host + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestPayload),
  });

  const data = await response.json();

  return data;
};
