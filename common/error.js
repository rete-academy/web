import { Message } from 'element-ui'
import i18n from '@/common/i18n'
import store from '@/store'

export default (error, message) => {
    if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // response has: status, headers, and data.
        switch (error.response.status) {
        case 400:
            Message({
                showClose: true,
                message: message || i18n.t('errors.bad_request'),
                type: 'error'
            })
            break
        case 401:
            Message({
                showClose: true,
                message: message || i18n.t('errors.unauthorized'),
                type: 'error'
            })
            store.commit('auth/SIGN_OUT')
            break
        case 403:
            Message({
                showClose: true,
                message: message || i18n.t('errors.access_denied'),
                type: 'error'
            })
            break
        case 404:
            Message({
                showClose: true,
                message: message || 'Not found',
                type: 'error'
            })
            break
        case 409:
            Message({
                showClose: true,
                message: message || i18n.t('errors.existing_user'),
                type: 'error'
            })
            break
        case 410:
            Message({
                showClose: true,
                message: message || i18n.t('errors.code_used'),
                type: 'error'
            })
            break
        case 500:
            Message({
                showClose: true,
                message: message || i18n.t('errors.network_error'),
                type: 'error'
            })
            break
        default:
            Message({
                showClose: true,
                message: message || i18n.t('errors.something_wrong'),
                type: 'error'
            })
        }
    } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
        Message({
            showClose: true,
            message: message || i18n.t('errors.network_error') + error.request,
            type: 'error'
        })
    } else {
        Message({
            showClose: true,
            message: message || i18n.t('errors.something_wrong') + error.message,
            type: 'error'
        })
    }
}
