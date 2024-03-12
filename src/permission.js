import { router } from '@/router/index'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { userStore } from '@/stores/userStore'
import { groupUser } from './api/user'

//白名单
//允许无token的情况下访问的页面
const whiteList = ['/login','/404']

//前置路由守卫
router.beforeEach(async (to, from, next) => {
    nProgress.start()
    const store = userStore()
    if(store.userToken){
        // try {
        //     await groupUser() 
        // } catch (err) {
        //     next('/login') //中转到登录页
        //     return store.clearToken()
        // }
        //存在token
        if(to.path === '/login'){
            //跳转至主页
            next('/select')

        }else{
            //放过
            next()
        }
    }else{
        //不存在token
        if(whiteList.includes(to.path))
        {
            //在白名单中，放过
            next()
        }else{
            next('/login') //中转到登录页
        }
    }
})

//后置路由守卫
router.afterEach(() => {
    nProgress.done()
})