const { jsonAuthGet, jsonGet } = require('.');

export const getOwnPage = async () => {
  const url = '/api/page/load';
  const page = await jsonAuthGet(url);

  return page;
};

export const getPage = async (userId) => {
  const url = `/api/page/${userId}`;
  const page = await jsonGet(url);

  return page;
};

export const publishPage = async () => {
  const url = '/api/page/publish';
  const result = await jsonAuthGet(url);

  return result;
};
