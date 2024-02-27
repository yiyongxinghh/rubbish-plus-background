<template>
    <div class="nav">
        <a-breadcrumb class="my-breadcrumb">
            <a-breadcrumb-item v-for="(route, index) in breadcrumbRoutes" :key="index">
                <router-link :to="route.path">{{ route.meta.title }}</router-link>
            </a-breadcrumb-item>
        </a-breadcrumb>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue'
const route = useRoute();
console.log(route);
// 计算面包屑导航的路由数组
const breadcrumbRoutes = computed(() => {
    const matchedRoutes = route.matched;
    return matchedRoutes.map(route => ({
        path: route.path,
        meta: route.meta,
    }));
});
</script>

<style scoped lang="scss">
    .nav {
        animation: show-move 0.6s linear;
        margin-bottom: 10px;
        .my-breadcrumb {
            background: linear-gradient(135deg,
                    #1B1D23,
                    #52585d,
                    #c4cdc9);
            background-size: 200% 200%;
            animation: gradient-move 4s ease-in-out infinite alternate;
            border-radius: 5px;
            padding: 10px;

            a {
                color: #5f676e;
                font-size: 17px;
                font-weight: 550;
            }

            li:last-child a {
                color: #00b96b;
            }
        }
    }
</style>