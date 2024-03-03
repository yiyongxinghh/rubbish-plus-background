<template>
    <div class="content">
        <BackGround />
        <div class="select">
            <h1 class="iconfont" @click="pushRoute('/download')">下载</h1>
            <h1 class="iconfont" @click="pushRoute('/admin')">后台</h1>
        </div>
    </div>

</template>

<script setup>
import BackGround from "@/components/BackGround/BackGround.vue";
import { message } from 'ant-design-vue';
import { useRouter } from "vue-router";
import { userStore } from '@/stores/userStore'
// 获取路由实例
const router = useRouter();
// 获取用户信息
const user = userStore();

// 路由跳转
const pushRoute = (value) => {
    if (value === '/download') return router.push(value);
    if (user.userDate.userRank == 2 && value === '/admin') return router.push(value);
    else return message.warn({
        content: '权限不足',
        duration: 1,
    })
}
</script>

<style scoped lang="scss">
.content {
    position: relative;

    .select {
        position: absolute;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: space-around;
        align-items: center;

        .iconfont {
            user-select: none;
            cursor: pointer;
            font-weight: 700;
            font-size: 60px;
            color: #fff;
            transition: all 0.5s;
            animation: .5s linear fadeIn;

            &:hover {
                transform: scale(1.2);
            }
        }
    }
}


@keyframes fadeIn {
    0% {
        opacity: 0;
        translate: -500px;
    }

    100% {
        opacity: 1;
    }
}
</style>