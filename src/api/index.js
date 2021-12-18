import axios from 'axios'
import store from '@/store'
import {getAccessToken, getRefreshToken, jwt_prefix} from "@/utils/auth";

export let baseUrl = process.env.VUE_APP_APIURL
export let system_api = axios.create({
    baseURL: baseUrl + '/system', headers: {
        'Content-Type': 'application/json',

    }
})
export let location_api = axios.create({
    baseURL: baseUrl + '/location', headers: {
        'Content-Type': 'application/json',

    }
})
//在這裡統一加上Authorization
location_api.interceptors.request.use(
    config => {
        if (store.state.user.access_token) {
            config.headers['Authorization'] = `${jwt_prefix} ${getAccessToken()}`
        }
        return config
    })
location_api.interceptors.response.use(
    response => {
        return response
    },
    error => {
        switch (error.response.status) {
            case 401: {
                const refresh_token_url = `${baseUrl}/system/token/refresh`
                if (`${error.config.baseURL}${error.config.url}` !== refresh_token_url) {
                    const original_request = error.config
                    return axios.post(refresh_token_url, {refresh: getRefreshToken()})
                        .then((response) => {
                            store.dispatch('user/set_access_token', response.data.access)
                            original_request.headers.Authorization = `${jwt_prefix} ${response.data.access}`
                            return axios(original_request)
                        })
                        .catch((error) => {
                            console.log(error)
                            store.dispatch('user/logout')
                            return Promise.reject(error);
                        })
                }
            }
        }
        console.log(error.response)
        return Promise.reject(error);
    }
)