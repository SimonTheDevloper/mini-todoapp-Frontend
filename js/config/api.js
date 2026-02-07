const isLocal = window.location.hostname === 'localhost' || '127.0.0.1';

export const apiBase = isLocal ? "http://localhost:3000" : "/api"
