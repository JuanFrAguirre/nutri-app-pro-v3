import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // include cookies (e.g. authorization cookie) on every request
  withCredentials: true,
});
