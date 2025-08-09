import axios from 'axios';

const API_BASE = "http://192.168.1.28:8080/api";

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
