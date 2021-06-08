import { jsonGet } from '.';

export const previewLink = async (link) => {
  const url = `/api/preview?url=${encodeURIComponent(link)}`;

  const data = await jsonGet(url);
  return data;
};
