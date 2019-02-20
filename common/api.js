import axios from 'axios'
import Vue from 'vue'
import errorHandler from '@/common/error.handler'

Vue.prototype.$axios = axios

const api = {
    init() {
        axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL
        const token = localStorage.getItem('access_token')
        if (token) this.setHeaders(token)

        if (document.location.hostname !== 'localhost' && document.location.protocol !== 'https:') {
            document.location.protocol = 'https:'
        }
    },

    setHeaders(token) {
        return new Promise((resolve, reject) => {
            if (token) {
                axios.defaults.headers.common.Authorization = `Bearer ${token}`
                resolve({ success: true })
            } else {
                reject(new Error('Token not available'))
            }
        })
    },

    get(resource) {
        return axios
            .get(resource)
            .catch((e) => {
                errorHandler(e)
                throw e
            })
    },

    query(resource, slug = '') {
        return axios
            .get(`${resource}?${slug}`)
            .catch((e) => {
                errorHandler(e)
                throw e
            })
    },

    post(resource, data) {
        return axios
            .post(resource, data)
            .catch((e) => {
                errorHandler(e)
                throw e
            })
    },

    put(resource, data) {
        return axios
            .put(resource, data)
            .catch((e) => {
                errorHandler(e)
                throw e
            })
    },

    delete(resource) {
        return axios
            .delete(resource)
            .catch((e) => {
                errorHandler(e)
                throw e
            })
    }
}

export default api
