import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Admin from '@/views/Admin/Admin.vue'
import Login from '@/views/Login/Login.vue'
import Count from '@/views/Admin/Home/Count.vue'
import Manage from '@/views/Admin/Home/Manage.vue'
import Operate from '@/views/Admin/Home/Operate.vue'
import NotFound from "@/views/NotFound/NotFound.vue";
import GarbageTable from "@/components/Table/GarbageTable.vue";
import UserTable from "@/components/Table/UserTable.vue";
import CategoryTable from "@/components/Table/CategoryTable.vue";
import PicTable from "@/components/Table/PicTable.vue";
import CommentDetail from "@/views/Admin/Home/Components/CommentDetail.vue";
import LockSet from '@/views/Admin/Set/LockSet.vue'
import SystemSet from '@/views/Admin/Set/SystemSet.vue'
import Select from '@/views/Select/Select.vue'
import DownLoad from '@/views/DownLoad/DownLoad.vue'

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/login',
            component: Login
        },
        {
            path:'/select',
            component: Select
        },
        {
            path:'/download',
            component: DownLoad
        },
        {
            path: '/admin',
            component: Admin,
            meta: {
                title: '管理员页面'
            },
            children: [
                {
                    path: 'count',
                    component: Count,
                    meta: {
                        title: '统计'
                    }
                },
                {
                    path: 'manage',
                    component: Manage,
                    meta: {
                        title: '管理'
                    },
                    children:[
                        {
                            path: 'comment/:id', 
                            name: 'comment',
                            component: CommentDetail, 
                            meta: {
                                title: '评论详情'
                            },
                        }
                    ]
                },
                {
                    path: 'operate',
                    component: Operate,
                    meta: {
                        title: '操作'
                    },
                    children: [
                        {
                            name: 'garbageOperate',
                            path: 'garbageOperate',
                            component: GarbageTable,
                            meta: {
                                title: '废品操作面板'
                            },
                        },
                        {
                            name: 'userOperate',
                            path: 'userOperate',
                            component: UserTable,
                            meta: {
                                title: '用户操作面板'
                            },
                        },
                        {
                            name: 'categoryOperate',
                            path: 'categoryOperate',
                            component: CategoryTable,
                            meta: {
                                title: '分类操作面板'
                            },
                        },
                        {
                            name: 'picOperate',
                            path: 'picOperate',
                            component: PicTable,
                            meta: {
                                title: '图片操作面板'
                            },
                        },
                    ]
                },
                {
                    path: 'lockset',
                    component: LockSet,
                    meta: {
                        title: '锁定'
                    }
                },
                {
                    path: 'systemset',
                    component: SystemSet,
                    meta: {
                        title: '系统'
                    }
                },
            ]
        },
        {
            path: '/404',
            component: NotFound,
        },
        {
            path: '/',
            redirect: '/login',
        }
    ]
})