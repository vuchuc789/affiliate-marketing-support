import { jsonAuthGet, jsonAuthPost } from '.';

export const getAdpiaInfo = async () => {
  const url = '/api/adpia/get';
  const adpiaInfo = await jsonAuthGet(url);

  return adpiaInfo;
};

export const setAdpiaInfo = async (adpiaInfo) => {
  const url = '/api/adpia/set';
  const result = jsonAuthPost(url, adpiaInfo);

  return result;
};

export const getCoupons = async () => {
  const url = '/api/adpia/coupons';
  const coupons = await jsonAuthGet(url);

  return coupons;
};
