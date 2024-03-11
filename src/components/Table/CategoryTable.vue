<template>
    <div class="category-table">
        <a-table :dataSource="dataSource" :columns="columns" bordered :loading="loading" :row-selection="rowSelection"
            :pagination="pagination">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'name'">
                    <a>{{ text }}</a>
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
                <span class="category-title">
                    {{ route.meta.title }}
                </span>
            </template>
            <template #footer>
                <div class="category-footer">
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
    <CategoryModal :show="show" :modalData="modalData" />
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCategory, removeCategory, deleteBatchCategory } from '@/api/category'
import { Modal, message } from 'ant-design-vue'
import CategoryModal from '../OperateModal/CategoryModal.vue';
import emitter from '@/utils/emitter';
const route = useRoute()

const loading = ref(true) //加载中

const show = ref(false) //模态框显示

let selected = [] //选中的数据

const [modal, contextHolder] = Modal.useModal();

let modalData = reactive({}) //模态框回显数据

//分页器
const pagination = reactive({
    pageSize: 5,
    current: 1,
    total: 1,
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
        console.log(selected);
    }
};
//列
const columns = [{
    title: '分类名',
    dataIndex: 'categoryName',
    align: 'center'
},
{
    title: '操作',
    dataIndex: 'operate',
    align: 'center'
},
]
let dataSource = reactive([]) //数据源

//显示模态框
const showModal = (str) => {
    switch (str) {
        case 'show':
            show.value = !show.value;
            modalData = {}
            break;
    }
}

//移除单个
const remove = async (id) => {
    try {
        await removeCategory(id)
        message.success('删除成功')
    } catch (error) {
        message.error('删除失败')
    }
    requestData(pagination.current, pagination.pageSize)
}

//批量删除
const removeAll = async () => {
    try {
        await deleteBatchCategory(selected)
        message.success('删除成功')
    } catch (error) {
        message.error('删除失败')
    }
    selected = []
    requestData(pagination.current, pagination.pageSize)
}

//批量删除模态框
const removeModelShow = () => {
    if (selected.length === 0) {
        message.warning('请选择要删除的数据')
        return
    }
    modal.warning({
        title: '警告 是否确认批量删除',
        onOk: () => removeAll(),
        closable: true,
        maskClosable: true
    })
}

//操作
const handleModal = (record) => {
    show.value = !show.value
    modalData = record
}

//元数据请求
const requestData = async (page = '', pageSize = '') => {
    loading.value = true
    const { category, total } = await getCategory(page, pageSize)
    category.forEach(item => item.key = item.categoryId)
    dataSource = category
    pagination.total = total
    loading.value = false
}

onMounted(() => {
    emitter.on('request-data-category', () => requestData())
    requestData()
})

onUnmounted(() => {
    emitter.off('request-data-category')
})
</script>

<style lang="scss" scoped>
.category-table {
    width: 100%;

    .category-title {
        font-size: 17px;
        font-weight: 600;
    }

    .category-footer {
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