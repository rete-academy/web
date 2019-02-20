import Vue from 'vue'
import moment from 'moment'

// These functions usually are used in component as filters,
// And Vue automatic put the variable stands in front of | character as first argument
// so we will pass the second, and third and so on.
// For example, truncate can be used in component like this:
// {{ sampleText | truncate(20, 'read more') }}
// which, 20 is length and 'read more' is the replace string.

const convertTime = (time, format) => {
    if (time) return moment(time).format(format)
    return '-'
}

const convertByte = (bytes, decimals) => {
    if (bytes === 0) return ''
    const k = 1024
    const dm = decimals <= 0 ? 0 : decimals || 2
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`
}

const truncate = (string, length, replace) => {
    const value = string && typeof string !== 'string' ? string.toString() : string

    if (value && value.length > length) {
        return `${value.substring(0, length)} ${typeof replace === 'string' ? replace : '...'}`
    }
    return value
}

Vue.filter('convertTime', convertTime)
Vue.filter('convertByte', convertByte)
Vue.filter('truncate', truncate)
