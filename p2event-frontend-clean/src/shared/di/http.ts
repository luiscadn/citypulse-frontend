// src/shared/di/http.ts
import { FetchHttpClient } from '../infrastructure/fetch-http-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/** TODO: conectar con el almacenamiento del token cuando exista la feature auth. */
const getToken = () =>
  typeof window === 'undefined' ? null : window.localStorage.getItem('accessToken');

export const http = new FetchHttpClient(API_URL, getToken);
