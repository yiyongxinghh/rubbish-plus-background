<template>
    <a-list item-layout="horizontal" size="large" :pagination="pagination" :data-source="dataSource" bordered>
        <template #renderItem="{ item }">
            <a-list-item>
                <template #actions>
                    <a-button type="primary" @click="readMessage(item)">查看</a-button>
                </template>
                <a-list-item-meta :description="item.messageIsRead ? '已读' : '未读'">
                    <template #avatar>
                        <a-avatar src="" />
                    </template>
                    <template #title>
                        <h1>{{ item.userName }}</h1>
                    </template>
                </a-list-item-meta>
            </a-list-item>
        </template>
    </a-list>
    <a-drawer v-model:open="open" width="30vw" style="backgroundColor:rgba(255,255,255,0.25)" :title="title" @ok="handleOk">
        <Chat :messages="messages" :userDate="userDate"/>
    </a-drawer>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getMessageList } from '@/api/message'
import { findAllUser } from '@/api/user'
import { userStore } from '@/stores/userStore'
import Chat from '@/components/Chat/Chat.vue'
import { socket } from '@/utils/socket'
import { anyType } from 'ant-design-vue/es/_util/type'
//引仓库
const store = userStore()
const userName = store.userDate.userName

//控制模态框
const open = ref(false)
//数据源
let dataSource = ref([])

//消息标题
const title = ref('')

//消息集合
const messages = ref([])
//查看的用户信息
const userDate = ref({})



//分页器
const pagination = reactive({
    pageSize: 5,
    current: 1,
    total: 0,
    onChange: (page, pageSize) => {
        pagination.current = page
        pagination.pageSize = pageSize
        getMessage(page, pageSize)
    }
});

//确定已读
const handleOk = () => {

}


//查看消息
const readMessage = async (item) => {
    title.value = ` ${item.userName}的消息`
    const data = await getMessage(store.userDate.userId,item.userId)
    console.log(item,data);
    if(data.length > 0){
        messages.value = data[0]
    }else{
        messages.value = {
            messages:[]
        }
    }
    userDate.value = item
    open.value = true;
}

//获取指定用户消息数据
const getMessage = async (senderId,recipientId) => {
    const { groupedMessages } = await getMessageList('', '', senderId,recipientId)
    console.log(groupedMessages);
    return groupedMessages
}

//获取用户列表
const getUserList = async (page = '', pageSize = '') => {
    const { users, total } = await findAllUser(page, pageSize, store.userDate.userId)
    dataSource.value = users
    pagination.total = total
}

onMounted(() => {
    getUserList()
    //监听请求资源
    socket.on('request-data', () => getMessage())
})
</script>

<style scoped></style>