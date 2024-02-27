import { defineStore } from 'pinia'
import { ref } from 'vue'

export const userStore = defineStore('userStore', () => {

    //邮箱错误判断
    const isEmailError = ref(false)

    //密码错误判断
    const isPassError = ref(false)

    //用户信息
    const userDate = ref({})

    //token
    const userToken = ref('')

    //改变错误判断
    const errorhandler = (err, obj) => {
        switch (obj) {
            case 'isEmailError':
                isEmailError.value = err
                break;
            case 'isPassError':
                isPassError.value = err
                break;
        }
    }

    //保存token
    const saveToken = (token) => {
        userToken.value = token
    }
    
    //清空token
    const clearToken = () => {
        userToken.value = ''
    }

    //保存用户信息
    const saveUserData = (date) => {
        userDate.value = date
    }
    
    //清空用户信息
    const clearUserData = () => {
        userDate.value = {}
    }

    return {
        isEmailError,
        isPassError,
        userDate,
        userToken,
        saveToken,
        clearToken,
        errorhandler,
        saveUserData,
        clearUserData
    }
}, { persist: true })