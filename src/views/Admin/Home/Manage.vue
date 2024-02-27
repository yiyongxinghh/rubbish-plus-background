<template>
    <div class="content">
        <Banner />
        <a-tabs v-model:activeKey="activeKey" size="large">
            <a-tab-pane key="1" tab="消息">
                <ManageMessage />
            </a-tab-pane>
            <a-tab-pane key="2" tab="评论">
                <ManageComment />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import Banner from '@/components/Banner/Banner.vue'
import { userStore } from '@/stores/userStore'
import ManageMessage from './Components/ManageMessage.vue'
import ManageComment from './Components/ManageComment.vue'
//引入socket
import { socket, send, over } from '@/utils/socket'
import { onMounted, reactive, ref } from 'vue';

import { useRoute } from 'vue-router'
const route = useRoute()

const activeKey = ref('1');

onMounted(() => {
    activeKey.value = route.query.key
})
</script>

<style lang="scss" scoped>
.content {
    padding: 10px 20px;
    box-sizing: border-box;

    .loadmore-list {
        min-height: 350px;
    }
}
</style>