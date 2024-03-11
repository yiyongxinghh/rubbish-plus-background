<template>
  <div class="content">
    <Banner />
    <div class="home-chart">
      <div class="chart-top">
        <div class="chart-item">
          <section class="chart-title">
            <h1><i>|</i>分类总数统计</h1>
            <button @click="openModal('categoryTotal')">详情</button>
          </section>
          <Pie ref="pie" />
        </div>
        <div class="chart-item">
          <section class="chart-title">
            <h1><i>|</i>废品总数统计</h1>
            <button @click="openModal('garbageTotal')">详情</button>
          </section>
          <Bar ref="bar" />
        </div>
      </div>
      <div class="chart-top">
        <div class="chart-item">
          <section class="chart-title">
            <h1><i>|</i>销量总数统计</h1>
            <button @click="openModal('saleTotal')">详情</button>
          </section>
          <Score ref="score" />
        </div>
        <div class="chart-item">
          <section class="chart-title">
            <h1><i>|</i>消息与评论统计</h1>
            <button @click="openModal('commentAndMessage')">详情</button>
          </section>
          <Message ref="message" />
        </div>
      </div>
    </div>
  </div>
  <CountModal :open="open" :modal="modal">
    <template v-slot:[modal]>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        bordered
        :pagination="pagination"
      >
      </a-table>
    </template>
  </CountModal>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import Banner from "@/components/Banner/Banner.vue";
import Pie from "@/components/Charts/PieChart.vue";
import Bar from "@/components/Charts/BarChart.vue";
import Score from "@/components/Charts/ScoreChart.vue";
import Message from "@/components/Charts/MessageChart.vue";
import CountModal from "@/components/OperateModal/CountModal.vue";
import { countStore } from "@/stores/countStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
const router = useRouter();
//引入总数仓库
const store = countStore();

const modal = ref("");
const open = ref(false);
//标准列
let columns;
//标准数据源
let dataSource = reactive([]);
//标准分页器
const pagination = reactive({
  pageSize: 5,
  current: 1,
  total: 0,
  onChange: (page, pageSize) => {
    pagination.current = page;
    pagination.pageSize = pageSize;
  },
});

const openModal = (str) => {
  modal.value = str;
  open.value = !open.value;
  const {
    garbageAmountTotalDataSource,
    garbageSaleTotalDataSource,
    categoryTotalDataSource,
  } = storeToRefs(store);
  switch (str) {
    case "categoryTotal":
      columns = [
        { title: "分类", dataIndex: "categoryName", align: "center" },
        { title: "总数", dataIndex: "count", align: "center" },
      ];
      dataSource = categoryTotalDataSource.value;
      pagination.total = categoryTotalDataSource.value.length;
      break;
    case "garbageTotal":
      columns = [
        { title: "废品名", dataIndex: "garbageName", align: "center" },
        { title: "库存", dataIndex: "garbageAmount", align: "center" },
      ];
      dataSource = garbageAmountTotalDataSource.value.garbages;
      pagination.total = garbageAmountTotalDataSource.value.garbages.length;
      break;
    case "saleTotal":
      columns = [
        { title: "废品名", dataIndex: "garbageName", align: "center" },
        { title: "销量", dataIndex: "totalQuantity", align: "center" },
      ];
      dataSource = garbageSaleTotalDataSource.value;
      pagination.total = garbageSaleTotalDataSource.value.length;
      break;
    case "commentAndMessage":
      router.push("/admin/manage");
      break;
  }
};

onMounted(async () => {});
</script>

<style lang="scss" scoped>
.content {
  padding: 10px 20px;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  .home-chart {
    display: flex;
    flex-direction: column;

    .chart-top {
      height: 50vh;
      display: flex;
      justify-content: space-evenly;

      .chart-item {
        border: 2px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        height: 100%;
        width: 44vw;
        display: flex;
        flex-direction: column;

        .chart-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          font-size: 18px;

          h1 {
            color: white;

            i {
              font-size: 24px;
              font-weight: 1000;
              color: #00b96b;
              margin-right: 10px;
            }
          }

          button {
            cursor: pointer;
            padding: 5px;
            width: 4rem;
            color: white;
            background-color: #20242a;
            font-size: 18px;
            border-radius: 5px;
            outline: none;
            border: none;
          }
        }
      }
    }
  }

  @keyframes gradient-move {
    0% {
      background-position: 0% 0%;
    }

    100% {
      background-position: 100% 100%;
    }
  }
}
</style>
