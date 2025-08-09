import axios from 'axios';

const API_BASE = "https://localhost:7117/api";

export const api = axios.create({
    baseURL: API_BASE,
});

export function setAuth(token: string | null) {
    if (token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else
        delete api.defaults.headers.common['Authorization'];
}

export {};
