<template>
  <div class="comment-card">
    <div v-if="loading" class="loading">
      <a-spin :spinning="loading" />
    </div>
    <div v-if="route.path === '/admin/manage'">
      <a-row :gutter="[16, 16]" class="content">
        <a-col v-for="item in dataSource" :span="6">
          <a-card hoverable>
            <template #cover>
              <img class="image" alt="example" :src="item.pic.picUrl" />
              <!-- <img class="image" alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" /> -->
            </template>
            <template #actions>
              <setting-outlined @click="setModal(item)" />
              <edit-outlined @click="showModal(item)" />
              <ellipsis-outlined @click="toDetail(item)" />
            </template>
            <a-card-meta
              :title="item.garbageName"
              :description="item.garbageType"
            >
              <template #avatar>
                <a-avatar :src="item.user.pic?.picUrl" />
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
      <div class="pagination">
        <a-pagination
          v-model:current="current"
          :total="total"
          :defaultPageSize="defaultPageSize"
          @change="onChange"
        />
      </div>
    </div>
    <router-view v-else></router-view>
    <GarbageModal :show="show" :modalData="modalData"></GarbageModal>
    <contextHolder />
  </div>
</template>

<script setup>
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons-vue";
import GarbageModal from "@/components/OperateModal/GarbageModal.vue";
import { getGarbage, deleteGarbage } from "@/api/garbage";
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import emitter from "@/utils/emitter";
import { Modal } from "ant-design-vue";
// 设置模态框
const [modal, contextHolder] = Modal.useModal();

const router = useRouter();
const route = useRoute();

// 响应式变量
const loading = ref(false);

//数据源
const dataSource = ref([]);

//编辑模态框展示标识
const show = ref(false);
//回显数据
const modalData = ref({});

const total = ref(100); // 总条数
const current = ref(1); // 当前页数
const defaultPageSize = ref(8); // 每页条数

// 分页回调函数
const onChange = (page, pageSize) => {
  console.log(page, pageSize);
  getData(page, pageSize);
};

//获取数据
const getData = async (page = "", pageSize = "") => {
  // 开启加载中状态
  loading.value = true;
  const data = await getGarbage(page, pageSize);
  total.value = data.total;
  dataSource.value = data.garbages;
  // 关闭加载中状态
  loading.value = false;
};

//跳转详情
const toDetail = (item) => {
  router.push({ name: "comment", params: { id: item.garbageId } });
};

//展示编辑模态框
const showModal = (item) => {
  show.value = !show.value;
  modalData.value = item;
};

//设置模态框
const setModal = (item) => {
  modal.confirm({
    title: "是否强制删除",
    centered: true,
    onOk: async () => {
      await deleteGarbage(item.garbageId);
      getData();
    },
  });
};

onMounted(() => {
  getData(current.value, defaultPageSize.value);
  emitter.on("request-data-garbage", () => {
    getData();
  });
});

onUnmounted(() => {
  emitter.off("request-data-garbage");
});
</script>

<style scoped lang="scss">
.comment-card {
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px;

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
  }

  .content {
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    margin-bottom: 10px;

    .image {
      width: 100%;
      height: 100%;
      padding: 10px;
      background-size: cover;
    }
  }

  .pagination {
    display: flex;
    justify-content: end;
  }
}
</style>
