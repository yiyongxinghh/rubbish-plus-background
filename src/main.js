import { createApp } from 'vue'
//全局全部引入AntdesignUI
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
//引入reset.scss
import '@/assets/styles/reset.scss'
import App from './App.vue'
//引入路由
import { router } from '@/router/index'
//引入pinia
import { createPinia } from 'pinia'
//pinia持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
//引入echarts
import * as echarts from 'echarts'
//导入主题
import { blackTheme } from '@/assets/theme/black'
import { whiteTheme } from '@/assets/theme/white'
//引入路由守卫
import './permission.js'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

window.echarts = echarts
//注册黑暗风格主题
echarts.registerTheme('black', blackTheme)
echarts.registerTheme('white', whiteTheme)


app.use(router)
app.use(pinia)
app.use(Antd)
app.mount('#app')
