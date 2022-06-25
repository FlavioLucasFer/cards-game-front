import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

export type ApiError = {
    message: string;
}

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3333/api/v1',
    transformRequest: [data => {
        if (!data)
            return data;
        return snakecaseKeys(data);
        
    }],
    transformResponse: [data => {
        if (!data)
            return data;
        return camelcaseKeys(JSON.parse(data));
    }],
});

export default axiosInstance;
