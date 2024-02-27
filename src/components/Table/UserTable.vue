<template>
    <div class="user-table">
        <a-table :dataSource="dataSource" :columns="columns" bordered :loading="loading" :row-selection="rowSelection"
            :pagination="pagination">
            <template #bodyCell="{ column, text,record }">
                <template v-if="column.dataIndex === 'userRank'">
                    <span v-if="text===0">普通用户</span>
                    <span v-else-if="text===1">配送者</span>
                    <span v-else="text===2">管理员</span>
                </template>
                <template v-if="column.dataIndex === 'operate'">
                    <a-space>
                        <a-button type="primary" @click="handleModal(record)">操作</a-button>
                        <a-popconfirm title="确定删除吗？" @confirm="remove(record.key)">
                            <a-button ghost>删除</a-button>
                        </a-popconfirm>
                    </a-space>
                </template>
            </template>
            <template #title>
                <span class="user-title">{{ route.meta.title }}</span>
            </template>
            <template #footer>
                <div class="user-footer">
                    <span>基本操作</span>
                    <div>
                        <a-space-compact block>
                            <a-button type="primary" @click="removeModelShow">批量删除</a-button>
                            <a-button type="primary" @click="showModal('show')">添加</a-button>
                        </a-space-compact>
                    </div>
                </div>
            </template>
        </a-table>
    </div>
    <contextHolder />
    <UserModal :show="show" :modalData="modalData" />
</template>

<script setup>
import { reactive, ref, onMounted,onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { findAllUser,deleteUsers,deleteUser } from '@/api/user'
import { userStore } from '@/stores/userStore'
import { Modal,message } from 'ant-design-vue'
import UserModal from '@/components/OperateModal//UserModal.vue';
import emitter from '@/utils/emitter';
const store = userStore() //用户信息

const route = useRoute()
const loading = ref(true) //加载中

const [modal, contextHolder] = Modal.useModal();
const show = ref(false) //模态框显示

let modalData = reactive({}) //模态框回显数据

let selected = [] //选中项

//分页器
const pagination = reactive({
    pageSize: 5,
    current: 1,
    total: 500,
    onChange: (page, pageSize) => {
        pagination.current = page
        requestData(page, pageSize)
    }
})
//多选器
const rowSelection = {
    //选中
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        selected = selectedRowKeys;
    }
};
//列
const columns = [{
    title: '用户名',
    dataIndex: 'userName',
    align: 'center'
},
{
    title: '手机号',
    dataIndex: 'userPhone',
    align: 'center'
},
{
    title: '邮箱',
    dataIndex: 'userEmail',
    align: 'center'
},
{
    title: '地址',
    dataIndex: 'userAddress',
    align: 'center'
},
{
    title: '分级',
    dataIndex: 'userRank',
    align: 'center'
},
{
    title: '操作',
    dataIndex: 'operate',
    align: 'center'
},
]
let dataSource = reactive([])
//请求数据
const requestData = async (page = '', pageSize = '') => {
    loading.value = true;
    const data = await findAllUser(page, pageSize,store.userDate.userId)
    data.users.forEach(item => item.key = item.userId)
    dataSource = data.users
    pagination.total = data.total
    loading.value = false;
}
//显示操作模态框
const showModal = (str) => {
    switch (str) {
        case 'show':
            show.value = !show.value
            modalData = {}
            break
    }
}
//模态框数据回显
const handleModal = async (record) => {
    show.value = !show.value
    modalData = record
}

//移除单个用户
const remove = async (id)=>{
    try {
        await deleteUser(id)
        message.success('删除成功')
    } catch (error) {
        message.error('删除失败')
    }
    requestData()
}

//批量删除model
const removeModelShow = () => {
    if (selected.length === 0) {
        message.warning('请选择要删除的数据')
        return
    }
    modal.warning({
        title: '警告 是否确认批量删除',
        onOk: () => removeBatch(),
        closable: true,
        maskClosable: true
    })
}

//批量删除
const removeBatch = async () => {
    try {
        await deleteUsers(selected)
        message.success('删除成功')
    } catch (error) {
        message.error('删除失败')
    }
    selected = []
    requestData()
}

onMounted(() => {
    emitter.on('request-data-user', () => requestData())
    requestData()
})
onUnmounted(() => {
    emitter.off('request-data-user')
})
</script>

<style lang="scss" scoped>
.user-table {
    width: 80VW;

    .user-title {
        font-size: 17px;
        font-weight: 600;
    }

    .user-footer {
        display: flex;
        justify-content: space-between;

        span {
            font-size: 16px;
            font-weight: 550;
            color: #c3c1c1;

        }
    }
}
</style>