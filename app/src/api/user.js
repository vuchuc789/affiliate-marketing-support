import { jsonAuthGet } from '.';

export const getUserInfo = async () => {
  const url = '/api/user/info';
  const userInfo = await jsonAuthGet(url);

  return userInfo;
};
