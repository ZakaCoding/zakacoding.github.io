import { API_URL } from './conversation/api';

const request = async (path, body, token) => {
  const response = await fetch(`${API_URL}/api/work/desk/${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Work desk request failed: ${response.status}`);
  return response.status === 202 ? null : response.json();
};

export const joinWorkDesk = async (name) => (await request('join', { name }))?.data;
export const sendWorkCursor = (token, position) => request('cursor', position || { active: false }, token);
