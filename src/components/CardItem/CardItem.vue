<template>
    <div class="card-item">
        <div class="card-header">
            <h2>{{ title }}</h2>
            <a-button type="primary" @click="toPath">查看</a-button>
        </div>
        <div class="card-body">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
const { to, title } = defineProps(['title', 'to'])

//数据源
let dataSource = []

const router = useRouter()
// 路径计算属性
const routePath = computed(() => {
    return {
        path: to.path,
        query: {
            key: to.query
        }
    }
})



// 跳转
const toPath = () => {
    router.push(routePath.value)
}

onMounted(() => {
    
})
</script>

<style scoped lang="scss">
.card-item {
    flex-basis: calc(33% - 20px);
    padding: 10px;
    margin: 10px;
    box-sizing: border-box;
    background-color: #383838;
    border-radius: 10px;

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #444;
        padding-bottom: 10px;

        h2 {
            color: #fff;
        }

    }

    .card-body {
        padding: 10px 0;

    }

    .card-chart {
        border-top: 1px solid #444;
    }
}
</style>