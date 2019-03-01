import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import '@/assets/scss/global.scss'
import '@/assets/scss/responsive.scss'

export default () => {
    Vue.use(Element, { locale })
}
