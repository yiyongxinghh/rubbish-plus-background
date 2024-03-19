<template>
    <div class="garbage-table">
        <a-table :dataSource="dataSource" :columns="columns" bordered :scroll="{ x: 1500 }"
            :row-selection="rowSelection" :loading="loading" :pagination="pagination">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'operate'">
                    <a-space>
                        <a-button type="primary" @click="handleModal(record)">操作</a-button>
                        <a-popconfirm title="确定删除吗？" @confirm="remove(record.key)">
                            <a-button ghost>删除</a-button>
                        </a-popconfirm>
                    </a-space>
                </template>
                <template v-if="column.dataIndex === 'pic'">
                    <a-button type="primary" @click="showModal('pic')">查看</a-button>
                    <a-modal v-model:open="picOpen" title="图片" :footer="null">
                        <a-image :src="record.pic.picUrl" alt=""></a-image>
                    </a-modal>
                </template>
                <template v-if="column.dataIndex === 'user'">
                    <a-tag color="#777">{{ record.user.userName }}</a-tag>
                </template>
            </template>
            <template #title>
                <span class="garbage-title">
                    {{ route.meta.title }}
                </span>
            </template>
            <template #footer>
                <div class="garbage-footer">
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
    <GarbageModal :show="show" :modalData="modalData" />
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { getGarbage, deleteGarbage, deleteGarbages, findorderToGarbage } from '@/api/garbage'
import { Modal, message } from 'ant-design-vue'
import GarbageModal from '@/components/OperateModal/GarbageModal.vue'
import emitter from '@/utils/emitter';
const [modal, contextHolder] = Modal.useModal();
const route = useRoute()
const show = ref(false) //模态框显示控制
let modalData = reactive({}) //模态框回显数据
const picOpen = ref(false)
const userOpen = ref(false)
const showModal = (str) => {
    switch (str) {
        case 'pic':
            picOpen.value = true
            break
        case 'user':
            userOpen.value = true
            break
        case 'show':
            show.value = !show.value
            modalData = {}
            break
    }
}

//列
const columns = [{
    title: '废品名',
    dataIndex: 'garbageName',
    fixed: 'left',
    align: 'center'
},
{
    title: '废品类型',
    dataIndex: 'garbageType',
    align: 'center'
},
{
    title: '废品库存',
    dataIndex: 'garbageAmount',
    align: 'center'
},
{
    title: '废品金额',
    dataIndex: 'garbagePrice',
    align: 'center'
},
{
    title: '图片',
    dataIndex: 'pic',
    align: 'center'
},
{
    title: '所属人',
    dataIndex: 'user',
    align: 'center'
},
{
    title: '操作',
    dataIndex: 'operate',
    fixed: 'right',
    align: 'center'
},
]
const loading = ref(true); //加载中
let dataSource = reactive([]) //数据源
let selected = reactive([]) //选中的行
//分页器
const pagination = reactive({
    pageSize: 5,
    current: 1,
    total: 0,
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
//单个删除
const remove = async (id) => {
    try {
        await deleteGarbage(id)
        message.success('删除成功')
    } catch (error) {
        message.error('删除失败')
    }
    requestData(pagination.current, pagination.pageSize)
}
//批量删除
const removeBatch = async () => {
    try {
        await deleteGarbages(selected)
        message.success('删除成功')
    } catch (error) {
        message.error('删除失败')
    }
    selected = []
    requestData()
}
//批量删除model
const removeModelShow = async () => {
    if (selected.length === 0) {
        message.warning('请选择要删除的数据')
        return
    }
    const { message } = await findorderToGarbage(selected)
    modal.warning({
        title: message,
        onOk: () => removeBatch(),
        maskClosable: true
    })
}
//请求数据
const requestData = async (page = '', pageSize = '') => {
    loading.value = true;
    const data = await getGarbage(page, pageSize)
    data.garbages.forEach(item => item.key = item.garbageId)
    dataSource = data.garbages
    pagination.total = data.total
    loading.value = false;
}
//模态框数据回显
const handleModal = async (record) => {
    show.value = !show.value
    modalData = record
}
//挂载请求数据
onMounted(() => {
    emitter.on('request-data-garbage', () => requestData())
    requestData(pagination.current, pagination.pageSize)
})
onUnmounted(() => {
    emitter.off('request-data-garbage')
})
</script>

<style lang="scss" scoped>
.garbage-table {
    width: 100%;

    .garbage-title {
        font-size: 17px;
        font-weight: 600;
    }

    .garbage-footer {
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