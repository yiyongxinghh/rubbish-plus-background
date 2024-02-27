<template>
    <div class="head-container">
        <div class="search">
            <img src="../../assets/img/search.png" alt="">
            <input type="search" placeholder="Type here to search...">
        </div>
        <div class="user">
            <div class="user-media" :class="{ close: isMaskShow }" @click="maskShow">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'

//控制遮罩层显示
const isMaskShow = ref(false)

//浏览器宽度
const windowWidth = ref(0)

//注册路由器
const router = useRouter()

//控制遮罩层显示
const maskShow = () => {
    isMaskShow.value = !isMaskShow.value
}

//退出登录
const userExit = () => {
    router.push('/login')
}

//判断浏览器宽度，决定遮罩层的显示与否
const handleWindowResize = () => {
    // 更新窗口宽度
    windowWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (windowWidth.value > 767) isMaskShow.value = false
}

//防抖
const debounceHandle = debounce(handleWindowResize, 1000)

onMounted(() => {
    windowWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    window.addEventListener('resize', debounceHandle)
})

onBeforeMount(() => {
    window.removeEventListener('resize', debounceHandle)
})
</script>

<style lang="scss" scoped>
.head-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;

    .search {
        margin-left: 20px;
        display: flex;
        align-items: center;
        img{
            width: 18px;
            height: 18px;
            margin-right: 10px;
        }
        input{
            background-color: transparent;
            border: none;
            outline: none;
            color: white;
            font-size: 16px;
        }
    }

    .user {
        display: flex;
        align-items: center;
        margin-right: 10px;
    }

    @media screen and (max-width:767px) {

        .user-media {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            cursor: pointer;
            border-radius: 10px;
            margin-right: 10px;
            height: 30px;
            z-index: 5;

            .line {
                position: relative;
                width: 36px;
                height: 2px;
                background: linear-gradient(90deg, gray, white, gray);
                transition: all 0.3s linear;
            }
        }

        .close {
            .line {
                &:nth-child(1) {
                    transform-origin: left;
                    width: 40px;
                    transform: rotateZ(45deg);

                }

                &:nth-child(2) {
                    display: none;
                }

                &:nth-child(3) {
                    transform-origin: left;
                    width: 40px;
                    transform: rotateZ(-45deg);
                }
            }
        }
    }
}
</style>