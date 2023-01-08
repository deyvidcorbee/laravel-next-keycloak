import axios from 'axios';

export default function useHttp(keycloakInstance) {
    
    const http = axios.create({
        baseURL: 'http://localhost:8000/api'
    });

    http.interceptors.response.use((response) => response, async function (error) {
        if (error.response.status === 403) {
            await keycloakInstance.updateToken(-1);
            return http.request(error.config);
        }
        return Promise.reject(error);
    });

    http.interceptors.request.use(async config => {
        config.headers = { 
            'Authorization': `Bearer ${keycloakInstance.token}`,
            'Accept': 'application/json'
        }
        return config;
    }, error => {
        Promise.reject(error)
    });

    const get = async (url) => {
        try {
            const { data } = await http.get(url);
            return data;
        } catch (e) {
            return null;
        }
    }

    const post = async (url, params) => {
        try {
            const { data } = await http.post(url, params);
            return data;
        } catch (e) {
            return null;
        }
    }

    const put = async (url, params) => {
        try {
            const { data } = await http.put(url, params);
            return data;
        } catch (e) {
            return null;
        }
    }

    const Delete = async (url) => {
        try {
            const { data } = await http.delete(url);
            return data;
        } catch (e) {
            return null;
        }
    }

    return { get, post, put, Delete };
}