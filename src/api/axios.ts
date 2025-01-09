import Axios, { AxiosInstance } from 'axios'; 
class HttpBase {
    public api: AxiosInstance;

    constructor(baseURL: string = '') {
        this.api = Axios.create({
            baseURL: baseURL
        })
        this.api.interceptors.request.use(async (config) => {
            config.headers['Content-Type'] = 'application/json';
            config.headers['Acceess-Control-Allow-Origin'] = '*';
            return config;
        }
        );
    }
}


export {
    HttpBase,
}