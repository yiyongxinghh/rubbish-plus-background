import axios from "axios";
import { message } from 'ant-design-vue';
import { userStore } from '@/stores/userStore'
import { userLogin } from '@/common/userLogin'
import {router} from '@/router';

const { emailError, passError, userLive } = userLogin

//创建基础的axios实例
const httpInstance = axios.create({
    // baseURL: 'https://server.rubbish-plus.top/',
    baseURL: 'http://localhost:3000/',
    timeout: 10000,
})

//配置请求拦截器
httpInstance.interceptors.request.use((config) => {
    const store = userStore()
    const { userToken } = store
    if (userToken) config.headers['Authorization'] = `Bearer ${userToken}`
    return config
}, (err) => {
    Promise.reject(err)
})


//配置响应拦截器
httpInstance.interceptors.response.use((config) => {
    // console.log(config);
    return config.data.data
}, (err) => {
    const store = userStore()
    const { errorhandler } = store
    const errormsg = err.response.data.message
    message.error(Array.isArray(errormsg) ? errormsg[0] : errormsg, 3)
    if (Array.isArray(errormsg)) {
        errormsg.forEach(item => {
            if (item.indexOf('email') !== -1) errorhandler(true, emailError)
            if (item.indexOf('pass') !== -1) errorhandler(true, passError)
        })
    } else {
        if (errormsg.indexOf(userLive) !== -1) {
            errorhandler(true, emailError)
            errorhandler(true, passError)
        }
        if (errormsg === 'Unauthorized') {
            router.push('/login')
        }
    }

    return Promise.reject(err)
})

export default httpInstance