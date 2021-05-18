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
