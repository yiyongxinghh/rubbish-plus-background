<template>
  <div class="pic-table">
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      bordered
      :loading="loading"
      :row-selection="rowSelection"
      :pagination="pagination"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'picUrl'">
          <a-button type="primary" @click="showModal('pic')">查看</a-button>
          <a-modal v-model:open="picOpen" title="图片" :footer="null">
            <a-image :src="record.picUrl" />
          </a-modal>
        </template>
        <template v-if="column.dataIndex === 'picType'">
          <span>{{ picTypeName(record.picType) }}</span>
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <a-space>
            <a-button type="primary" @click="showModal('show',record)">操作</a-button>
            <a-popconfirm title="确定删除吗？" @confirm="remove(record.picId)">
              <a-button ghost>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
      <template #title>
        <span class="pic-title">
          {{ route.meta.title }}
        </span>
      </template>
      <template #footer>
        <div class="pic-footer">
          <span>基本操作</span>
          <div>
            <a-space-compact block>
              <a-button type="primary">批量删除</a-button>
              <a-button type="primary" @click="showModal('show')"
                >添加</a-button
              >
            </a-space-compact>
          </div>
        </div>
      </template>
    </a-table>
  </div>
  <PicModal :show="show" :pic="pic" />
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { getPicList, deletePic } from "@/api/pic";
import emitter from "@/utils/emitter";
import PicModal from "../OperateModal/PicModal.vue";
const route = useRoute();
const loading = ref(true);

const picOpen = ref(false); //图片显示模态框

const show = ref(false); //模态框显示
const pic = ref({}); //模态框数据

//分页器
const pagination = reactive({
  pageSize: 5,
  current: 1,
  total: 500,
  onChange: (page, pageSize) => {
    pagination.current = page;
    requestData(page, pageSize);
  },
});
//多选器
const rowSelection = {
  //选中
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
    selected.push(selectedRowKeys);
  },
};
const columns = [
  {
    title: "图片",
    dataIndex: "picUrl",
    width: 200,
    align: "center",
  },
  {
    title: "图片所属",
    dataIndex: "picType",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "operate",
    align: "center",
  },
];
const picTypeName = (str)=>{
  switch (str){
    case 'userPic':
      return '用户图'
    case 'backPic':
      return '背景图'
    case 'goodPic':
      return '废品图'
  }
}
let dataSource = reactive([]); //数据源
//请求数据
const requestData = async (page = "", pageSize = "") => {
  loading.value = true;
  const data = await getPicList(page, pageSize);
  data.pics.forEach((item) => (item.key = item.garbageId));
  dataSource = data.pics;
  pagination.total = data.total;
  loading.value = false;
};
//单个删除
const remove = async (id) => {
  await deletePic(id);
  requestData();
};
//显示操作模态框
const showModal = (str,item) => {
  switch (str) {
    case "show":
      show.value = !show.value;
      if(item) pic.value = item
      else pic.value = {}
      break;
    case "pic":
      picOpen.value = true;
      break;
  }
};
onMounted(() => {
  requestData();
  emitter.on('request-data-pic',()=>{requestData()})
});
onUnmounted(()=>{
  emitter.off('request-data-pic')
})
</script>

<style lang="scss" scoped>
.pic-table {
  width: 100%;

  .pic-title {
    font-size: 17px;
    font-weight: 600;
  }

  .pic-footer {
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
