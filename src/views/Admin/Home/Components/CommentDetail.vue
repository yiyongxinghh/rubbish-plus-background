<template>
  <div v-if="loading" class="loading">
    <a-spin :spinning="loading" />
  </div>
  <div v-else class="comment-detail">
    <div class="detail-title">
      <h1>详情</h1>
      <div class="detail-score">
        <div class="score-item">
          <span>评论</span>
          <span>{{ pagination.total }}</span>
        </div>
        <div class="score-item">
          <span>评分</span>
          <span>{{ score}}</span>
        </div>
        <div class="score-item">
          <span>收藏</span>
          <span>{{ collection }}</span>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="detail-image">
        <a-image
          :height="250"
          src="https://server.rubbish-plus.top/files/1708689963958.jpg"
        />
        <div class="detail-introduce">
          <a-tag color="#777" :title="garbage.garbageName"
            >废品名称: {{ garbage.garbageName }}</a-tag
          >
          <a-tag color="#777" v-if="garbage.user" :title="garbage.user.userName"
            >所属人: {{ garbage.user.userName }}</a-tag
          >
          <a-tag
            color="#777"
            v-if="garbage.category"
            :title="garbage.category.categoryName"
            >废品类型: {{ garbage.category.categoryName }}</a-tag
          >
          <a-tag color="#777" :title="garbage.garbageType"
            >具体分类: {{ garbage.garbageType }}</a-tag
          >
        </div>
      </div>
      <div class="detail-list">
        <div class="list-title">
          <h1>消息列表</h1>
          <a-segmented
            v-model:value="selected"
            :options="selectOptions"
            size="middle"
            @change="handleSelect"
          >
            <template #label="{ title }">{{ title }}</template>
          </a-segmented>
        </div>
        <div class="list-content">
          <a-list item-layout="horizontal" :data-source="commentData">
            <template #renderItem="{ item }">
              <a-list-item>
                <template #extra>
                  <a-tag color="#777">评分：{{ item.commentScore }}</a-tag>
                </template>
                <a-list-item-meta :description="item.commentTime">
                  <template #title>
                    <span>{{ item.commentContent }}</span>
                  </template>
                  <template #avatar>
                    <a-avatar src="https://joeschmoe.io/api/v1/random" />
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </div>
    </div>
    <div class="detail-page">
      <a-pagination
        :total="pagination.total"
        show-size-changer
        @change="pagination.onChange"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { getGarbageOne } from "@/api/garbage";
import { getGarbageCount } from '@/api/collection'
import {
  getHotCommentList,
  getNewCommentList,
  getAverageScore,
} from "@/api/comment";
import {} from "@/api/comment";

//路由
const route = useRoute();

//废品数据
const garbage = ref({});

// 评论数据
const commentData = ref([]);

// 评分
const score = ref(0);
//收藏
const collection = ref(0);

//分页器
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 50,
  showTotal: (total) => `共 ${total} 条`,
  onChange: (page, pageSize) => {
    pagination.current = page;
    pagination.pageSize = pageSize;
  },
});

//选项卡
const selectOptions = reactive([
  {
    title: "最新",
    value: 0,
  },
  {
    title: "最热",
    value: 1,
  },
]);
const selected = ref(selectOptions[0].value);
//选项卡控制方法
const handleSelect = async (value = 0) => {
  if (value === 0) {
    const { comments, total } = await getNewCommentList(
      pagination.current,
      pagination.pageSize,
      route.params.id
    );
    commentData.value = comments;
    pagination.total = total;
  } else if (value === 1) {
    const { comments, total } = await getHotCommentList(
      pagination.current,
      pagination.pageSize,
      route.params.id
    );
    commentData.value = comments;
    pagination.total = total;
  }
};

//评论列表
const commentList = ref([]);
//加载标识
const loading = ref(false);

//获取废品数据
const getGarbageData = async () => {
  garbage.value = await getGarbageOne(route.params.id);
};

//获取收藏废品总数
const getGarbageCollectionCount = async () =>{
  collection.value = await getGarbageCount(route.params.id);
}

// 获取平均评分
const getAvgScore = async () => {
  const data = await getAverageScore(route.params.id);
  if(data) score.value =  parseFloat(data.average_score).toFixed(1);
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([getGarbageData(), getAvgScore(),getGarbageCollectionCount()]);
  await handleSelect();
  loading.value = false;
});
</script>

<style scoped lang="scss">
.comment-detail {
  .detail-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.15);
    padding: 10px;
    margin: 10px 0;

    h1 {
      font-size: 18px;
      font-weight: bold;
      color: #00b96b;
    }

    .detail-score {
      display: flex;
      justify-content: end;
      width: 20%;
      font-size: 16px;
      font-weight: bold;
      align-items: center;

      .score-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 20px;
      }
    }
  }

  .detail-content {
    display: flex;
    justify-content: space-between;
    height: 70vh;
    .detail-image {
      overflow: hidden;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      background-size: cover;
      margin-right: 10px;
      align-items: center;

      .detail-introduce {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        text-align: center;

        span {
          margin: 10px;
          padding: 10px;
          font-size: 22px;
          overflow: hidden;
          white-space: nowrap;
          /* 防止文字换行 */
          text-overflow: ellipsis;
        }
      }
    }

    .detail-list {
      flex: 1;
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.15);
      width: 100%;
      height: 100%;

      .list-title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h1 {
          font-size: 18px;
          margin: 10px;
          padding-left: 10px;
          border-left: 3px solid #00b96b;
        }
      }

      .list-content {
        width: 100%;
        height: 100%;
        overflow: auto;

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }

  .detail-page {
    width: 100%;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.15);
    padding: 10px;
    margin: 10px 0;
    display: flex;
    justify-content: end;
    align-items: center;
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
</style>
