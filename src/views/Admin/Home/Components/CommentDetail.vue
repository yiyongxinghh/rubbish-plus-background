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
                    <span>1.0</span>
                </div>
                <div class="score-item">
                    <span>评分</span>
                    <span>1.0</span>
                </div>
                <div class="score-item">
                    <span>收藏</span>
                    <span>1.0</span>
                </div>
            </div>
        </div>
        <div class="detail-content">
            <div class="detail-image">
                <a-image :height="250" src="https://server.rubbish-plus.top/files/1708689963958.jpg" />
                <div class="detail-introduce">
                    <span :title="garbage.garbageName">废品名称:{{ garbage.garbageName }}</span>
                    <span v-if="garbage.user" :title="garbage.user.userName">所属人:{{ garbage.user.userName }}</span>
                    <span v-if="garbage.category" :title="garbage.category.categoryName">废品类型:{{ garbage.category.categoryName }}</span>
                    <span :title="garbage.garbageType">具体分类:{{ garbage.garbageType }}</span>
                </div>
            </div>
            <div class="detail-list">
                <div class="list-title">
                    <h1>消息列表</h1>
                    <a-segmented v-model:value="selected" :options="selectOptions" size="middle" @change="handleSelect">
                        <template #label="{ label }">{{ label }}</template>
                    </a-segmented>
                </div>
                <div class="list-content">
                    <a-list item-layout="horizontal" :data-source="data">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-list-item-meta
                                    description="Ant Design, a design language for background applications, is refined by Ant UED Team">
                                    <template #title>
                                        <a href="https://www.antdv.com/">{{ item.title }}</a>
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
            <a-pagination :total="pagination.total" show-size-changer @change="pagination.onChange" />
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getGarbageOne } from '@/api/garbage'
import { } from '@/api/comment'

//路由
const route = useRoute();

//废品数据
const garbage = ref({});

//选项卡
const selectOptions = ref([
    {
        label: '最新',
        value: 0
    },
    {
        label: '最热',
        value: 1
    }]);
const selected = ref('最新');
//选项卡控制方法
const handleSelect = (value) => {
    console.log(value);
}

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

//评论列表
const commentList = ref([]);
//加载标识
const loading = ref(false);
const data = [
    {
        title: 'Ant Design Title 1',
    },
    {
        title: 'Ant Design Title 2',
    },
    {
        title: 'Ant Design Title 3',
    },
    {
        title: 'Ant Design Title 4',
    },
];

const getGarbageData = async () => {
    garbage.value = await getGarbageOne(route.params.id);
    console.log(garbage.value);
}

onMounted(async () => {
    loading.value = true;
    await Promise.all([getGarbageData()]);
    loading.value = false;
})

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
            color: #00B96B;
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

        .detail-image {
            overflow: hidden;
            border-bottom-left-radius: 10px;
            border-top-left-radius: 10px;
            display: flex;
            background-size: cover;
            margin-right: 10px;
            align-items: center;

            .detail-introduce {
                width: 150px;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.15);
                border-bottom-right-radius: 10px;
                border-top-right-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-evenly;

                span {
                    font-size: 14px;
                    width: 80%;
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
            height: 250px;

            .list-title {
                display: flex;
                justify-content: space-between;
                align-items: center;

                h1 {
                    font-size: 18px;
                    margin: 10px;
                    padding-left: 10px;
                    border-left: 3px solid #00B96B;
                }
            }



            .list-content {
                width: 100%;
                height: 200px;
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