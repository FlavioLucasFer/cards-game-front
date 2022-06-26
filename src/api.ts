import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

export type ApiError = {
    message: string;
}

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3333/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    transformRequest: [data => {
        if (!data)
            return data;

        return JSON.stringify(snakecaseKeys(data));
    }],
    transformResponse: [data => {
        if (!data)
            return data;
        return camelcaseKeys(JSON.parse(data));
    }],
});

export default axiosInstance;
