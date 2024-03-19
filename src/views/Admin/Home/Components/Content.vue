<template>
  <div class="content">
    <div class="admin">
      <h1 class="header">欢迎使用废品回收系统</h1>
      <div class="card-box">
        <Card cardTitle="统计" class="card-grid-box-count">
          <template class="card-item-count">
            <div class="card-chart" v-for="countItem in countList">
              <CardItemChart :dataSource="countItem.getData()"></CardItemChart>
              <h1>{{ countItem.title }}</h1>
            </div>
          </template>
        </Card>
        <Card cardTitle="最新消息" class="card-grid-box-list">
          <div class="card-message">
            <a-list item-layout="horizontal" :data-source="topFive">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta
                    :description="item.messageContent"
                  >
                    <template #title>
                      <a href="https://www.antdv.com/">{{
                        item.sender.userName
                      }}</a>
                    </template>
                    <template #avatar>
                      <a-avatar src="" />
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </Card>
        <Card cardTitle="销售排行" class="card-grid-box-list">
          <div class="card-message">
            <a-list item-layout="horizontal" :data-source="garbageRankList">
              <template #renderItem="{ item }">
                <a-list-item @click="getQuantity(item)">
                  <template #extra>
                    <a-tag color="#777">销量：{{ item.totalQuantity }}</a-tag>
                  </template>
                  <a-list-item-meta :description="item.garbageType">
                    <template #title>
                      <a href="https://www.antdv.com/">{{
                        item.garbageName
                      }}</a>
                    </template>
                    <template #avatar>
                      <a-avatar :src="item.picUrl" />
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </Card>
        <Card cardTitle="销售图" class="card-grid-box-sale">
          <div class="card-item-sale">
            <SaleChart :showList="showList"></SaleChart>
          </div>
        </Card>
        <Card cardTitle="评论监控" class="card-grid-box-panel-left">
          <template class="card-item-container">
            <template v-for="manageItem in manageList">
              <cardItem :title="manageItem.title" :to="manageItem.to"
                ><i class="iconfont icon" v-html="manageItem.icon"></i>
              </cardItem>
            </template>
          </template>
        </Card>
        <Card cardTitle="设置" class="card-grid-box-panel-right">
          <template class="card-item-container">
            <template v-for="setItem in setList">
              <cardItem :title="setItem.title" :to="setItem.to"
                ><i class="iconfont icon" v-html="setItem.icon"></i>
              </cardItem>
            </template>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import Card from "./Card.vue";
import cardItem from "@/components/CardItem/CardItem.vue";
import CardItemChart from "@/components/Charts/CardItemChart.vue";
import SaleChart from "@/components/Charts/SaleChart.vue";
import { groupUser } from "@/api/user";
import {
  groupByGarbage,
  findOneGarbageQuantity,
  findAllGarbageQuantity,
} from "@/api/garbage";
import { getCategoryCommentTotals } from "@/api/comment";
import { getOrderTotal } from "@/api/order";
import { findTopFive } from "@/api/message";
import { onMounted, reactive, ref } from "vue";

// 最新消息列
const topFive = ref([]);

// 排行列表
const garbageRankList = ref([]);

// 展示列表
const showList = ref([]);

// 统计列表
const countList = reactive([
  {
    title: "用户统计",
    getData: async () => {
      const { group, total } = await groupUser();
      const dataSource = group.map((item) => {
        if (item.userRank === 0) item.userRank = "普通用户";
        else if (item.userRank === 1) item.userRank = "配送者";
        else if (item.userRank === 2) item.userRank = "管理员";
        return {
          value: item.count,
          name: item.userRank,
        };
      });
      return {
        dataSource,
        total,
      };
    },
  },
  {
    title: "废品统计",
    getData: async () => {
      const garbages = await groupByGarbage();
      console.log(garbages);
      const dataSource = garbages.map((item) => {
        return {
          value: item.garbageAmount,
          name: item.categoryName,
        };
      });
      const total = garbages.reduce((acc, cur) => acc + +cur.garbageAmount, 0);
      return {
        dataSource,
        total,
      };
    },
  },
  {
    title: "评论统计",
    getData: async () => {
      const data = await getCategoryCommentTotals();
      const dataSource = data.map((item) => {
        return {
          value: item.total,
          name: item.categoryName,
        };
      });
      const total = data.reduce((acc, cur) => acc + +cur.total, 0);
      return {
        dataSource,
        total,
      };
    },
  },
  {
    title: "订单统计",
    getData: async () => {
      const total = await getOrderTotal();
      console.log(total);
      const dataSource = [{
          value: total,
          name: '订单总数',
        }];
      return {
        dataSource,
        total,
      };
    },
  },
]);

// 管理列表
const manageList = [
  {
    title: "消息管理",
    icon: "&#xe625;",
    to: { path: "/admin/manage", query: 1 },
  },
  {
    title: "评论管理",
    icon: "&#xe601;",
    to: { path: "/admin/manage", query: 2 },
  },
];

// 设置列表
const setList = [
  { title: "设置", icon: "&#xe628;", to: { path: "/admin/setting" } },
];

/**
 * 获取最新前五消息
 */
const getTopFive = async () => {
  const data = await findTopFive();
  topFive.value = data;
};

// 获取垃圾排名
const getGarbegeRank = async () => {
  const data = await findAllGarbageQuantity();
  garbageRankList.value = data.sort(
    (a, b) => b.totalQuantity - a.totalQuantity
  );
};

// 获取指定废品的销量
const getQuantity = async (item = null) => {
  if (item) {
    const { orderToGarbage } = await findOneGarbageQuantity(item.garbageId);
    console.log(orderToGarbage);
    showList.value = orderToGarbage;
  } else {
    const { orderToGarbage } = await findOneGarbageQuantity(
      garbageRankList.value[0].garbageId
    );
    console.log(orderToGarbage);
    showList.value = orderToGarbage;
  }
};

onMounted(async () => {
  await Promise.all([getTopFive(), getGarbegeRank()]);
  await getQuantity();
});
</script>

<style lang="scss" scoped>
.content {
  padding: 10px 20px;
  box-sizing: border-box;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  .admin {
    animation: show-move 0.6s linear;

    .header {
      text-align: center;
      padding: 14px;
      color: #5f676e;
      font-size: 17px;
      font-weight: 550;
      background: linear-gradient(135deg, #1b1d23, #52585d, #c4cdc9);
      background-size: 200% 200%;
      border-radius: 5px;
      animation: gradient-move 4s ease-in-out infinite alternate;
      margin: 0 5px;
    }

    .card-box {
      display: grid;
      grid-template-columns: repeat(4, 1fr);

      .card-grid-box-count {
        grid-column: 1/4;
      }

      .card-grid-box-list {
      }

      .card-grid-box-sale {
        grid-column: 2/5;
      }

      .card-grid-box-panel-left {
        grid-column: 1/3;
      }

      .card-grid-box-panel-right {
        grid-column: 3/5;
      }

      .card-item-count {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 20px;
        align-items: center;
        /* 列之间的间隔 */

        .card-chart {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 20px;
          width: 100%;
          height: 300px;

          h1 {
            margin-top: 1rem;
            font-size: 12px;
            color: #8f959e;
          }
        }
      }

      .card-message {
        width: 100%;
        overflow: auto;

        &::-webkit-scrollbar {
          display: none;
        }
      }

      .card-item-sale {
        height: 40vh;
      }

      .card-item-container {
        height: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;

        .icon {
          font-size: 28px;
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
}

@media screen and (max-width: 768px) {
  // 响应式设计，当屏幕宽度小于等于768px时，应用以下
  .content {
    .admin {
      .card-box {
        grid-template-columns: 1fr;

        .card-grid-box-count {
          grid-column: 1;
        }

        .card-grid-box-list {
        }

        .card-grid-box-sale {
          grid-column: 1;
        }

        .card-grid-box-panel-left {
          grid-column: 1;
        }

        .card-grid-box-panel-right {
          grid-column: 1;
        }
      }
    }
  }
}
</style>
