<template>
    <div class="sideber-father">
        <div class="sidebar">
            <div class="sidebar-header">
                <img src="../../../../assets/img/rubbish-white.png" alt="">
                <h1>rubbish-plus</h1>
            </div>
            <ul class="nav-links">
                <li v-for="(nav, index) in navItems" :key="index" :class="{ active: activeIndex === index }"
                    @click="goPage(nav.path, index)">
                    <a class="nav-links-item">
                        <i class="iconfont"><span v-html="nav.icon"></span></i>
                        <span class="link-name">{{ nav.name }}</span>
                    </a>
                </li>
                <li @click="changeClose">
                    <div class="link-down" :class="{ show: close }">
                        <a class="nav-links-item">
                            <i class="iconfont">&#xe62d;</i>
                            <span class="link-name">设置</span>
                        </a>
                        <i class="iconfont">&#xe664;</i>
                    </div>
                    <ul class="sub-menu" :class="{ close: close }">
                        <li><router-link to="/admin/systemset" class="sub-menu-item"><i class="iconfont">&#xe628;</i>系统</router-link></li>
                        <li><router-link to="/admin/lockset" class="sub-menu-item"><i class="iconfont">&#xe626;</i>锁定</router-link></li>
                    </ul>
                </li>
            </ul>
            <div class="user">
                <div class="user-info">
                    <img src="../../../../assets/img/back.jpg">
                    <span>名字</span>
                </div>
                <a-popconfirm placement="right" title="你是否退出?" ok-text="Yes" cancel-text="No" @confirm="exit">
                    <template #icon><i class="iconfont">&#xe7ed;</i></template>
                    <i class="iconfont">&#xe7ed;</i>
                </a-popconfirm>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { userStore } from '@/stores/userStore';
const router = useRouter()
const close = ref(false)
const store = userStore()
const { clearToken, clearUserData } = store

const exit = () => {
    clearToken()
    clearUserData()
    router.push('/login')
}

//导航数组
const navItems = [
    { icon: "&#xe627;", name: "首页", path: "" },
    { icon: "&#xe621;", name: "统计", path: "count" },
    { icon: "&#xe629;", name: "管理", path: "manage" },
    { icon: "&#xe62c;", name: "操作", path: "operate" },
]
//导航是否激活
const activeIndex = ref(0)

/**
 * 控制导航栏跳转
 * @param {*} 
 */
const goPage = (keyPath, index) => {
    activeIndex.value = index
    console.log(keyPath, `/admin/${keyPath}`);
    if (keyPath === '') {
        router.push(`/admin`)
    } else {
        router.push(`/admin/${keyPath}`)
    }
}
//控制下拉菜单
const changeClose = () => {
    activeIndex.value = '' //控制单项激活
    close.value = !close.value
}
</script>

<style scoped lang="scss">
.sideber-father {
    position: relative;
    user-select: none;
    width: 260px;
    flex-shrink: 0;
    transition: all 0.3s linear;

    .sidebar {
        border-right: 1px solid #2B2B31;
        position: fixed;
        width: 260px;
        height: 100vh;

        .sidebar-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 20px 0;

            img {
                width: 68px;
                margin-bottom: 20px;
            }

            h1 {
                font-size: 20px;
                font-family: 'Roboto', sans-serif;
                color: white;
            }

        }

        .nav-links {
            box-sizing: border-box;
            height: 100%;
            overflow: auto;
            padding: 0 0 100px 0;

            &::-webkit-scrollbar {
                display: none;
            }

            li {
                transition: all 0.3s linear;
                cursor: pointer;

                .show {
                    &>i {
                        transform: rotateZ(-180deg);
                    }
                }

                i {
                    width: 70px;
                    height: 58px;
                    line-height: 58px;
                    text-align: center;
                    color: white;
                    font-size: 28px;
                    transition: all 0.5s ease;
                }

                .link-down {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                }

                .nav-links-item {
                    display: flex;
                    align-items: center;
                    padding-left: 50px;

                    .link-name {
                        font-size: 18px;
                    }
                }

                .sub-menu {
                    display: block;
                    padding: 0 6px 0 70px;
                    font-size: 16px;
                    background-color: #181818;
                    box-sizing: border-box;
                    transition: max-height 0.5s linear;
                    max-height: 0;
                    overflow: hidden;

                    li {
                        padding:5px;
                    }

                    .sub-menu-item{
                        display: flex;
                        align-items: center;
                    }

                }

                .close {
                    max-height: 999px;
                }

                &:hover {
                    background-color: #181818;
                }
            }

            .active {
                background-color: #181818;
            }
        }

        .user {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 76px;
            background-color: #181818;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            justify-content: space-between;

            .user-info {
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    width: 50px;
                    height: 50px;
                    overflow: hidden;
                    border-radius: 10px;
                    margin: 0 20px 0 50px;
                    object-fit: cover;
                    outline: none;
                    border: none;
                }

                span {
                    font-size: 18px;
                }
            }


            i {
                cursor: pointer;
                width: 58px;
                height: 58px;
                line-height: 58px;
                font-size: 20px;
            }
        }
    }
}
@media screen and (max-width: 768px) { // 响应式设计，当屏幕宽度小于等于768px时，应用以下
    .sideber-father{
        display: none;
    }
}
</style>