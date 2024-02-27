<template>
    <div class="content">
        <Banner />
        <div class="operate-panel">
            <div class="operate-title">
                <h3>操作面板</h3>
                <a-segmented v-model:value="segmentedValue" :options="segmentedData" size="large" @change="changeSegmented">
                    <template #label="{ title }">
                        <div>
                            <div>{{ title }}</div>
                        </div>
                    </template>
                </a-segmented>
            </div>
            <router-view></router-view>
            <div class="operate-content">
                <h1>请选择操作的子项</h1>
            </div>
        </div>
    </div>
</template>

<script setup>
import Banner from '@/components/Banner/Banner.vue'
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const segmentedData = [
    {
        value: 'garbageOperate',
        title: '废品',
    },
    {
        value: 'userOperate',
        title: '用户',
    },
    {
        value: 'picOperate',
        title: '图片',
    },
    {
        value: 'categoryOperate',
        title: '分类',
    },
]
const segmentedValue = ref('garbage');

// 切换数据源
const changeSegmented = (value) => {
    console.log(value);
    router.push({name:value})
}
</script>

<style lang="scss" scoped>
.content {
    padding: 10px 20px;
    box-sizing: border-box;

    .operate-panel {
        display: flex;
        flex-direction: column;
        .operate-title {
            padding: 10px 0;
            border-bottom: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;

            h3 {
                font-size: 20px;
                font-weight: 500;
                color: white;
            }
        }
        .operate-content{
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            h1{
                font-size: 28px;
                color: white;
            }
        }
    }
}
</style>