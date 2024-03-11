<template>
    <div class="content">
        <div class="admin">
            <h1 class="header">欢迎使用废品回收系统</h1>
            <div class="card-box-top">
                <Card cardTitle="统计">
                    <template class="card-item-container">
                        <div class="card-chart" v-for="countItem in countList">
                            <CardItemChart :dataSource="countItem.getData()"></CardItemChart>
                            <h1>{{ countItem.title }}</h1>
                        </div>
                    </template>
                </Card>
                <Card cardTitle="最新消息">
                    <div class="card-message">
                        <a-list item-layout="horizontal" :data-source="topFive">
                            <template #renderItem="{ item }">
                                <a-list-item>
                                    <a-list-item-meta :description="item.messageIsRead ? '已读' : '未读'">
                                        <template #title>
                                            <a href="https://www.antdv.com/">{{ item.sender.userName }}</a>
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
            </div>
            <div class="card-box-bottom">
                <Card cardTitle="评论监控">
                    <template class="card-item-container">
                        <template v-for="manageItem in manageList">
                            <cardItem :title="manageItem.title" :to="manageItem.to"><i class="iconfont icon"
                                    v-html="manageItem.icon"></i>
                            </cardItem>
                        </template>
                    </template>
                </Card>
                <Card cardTitle="设置">
                    <template class="card-item-container">
                        <template v-for="setItem in setList">
                            <cardItem :title="setItem.title" :to="setItem.to"><i class="iconfont icon"
                                    v-html="setItem.icon"></i>
                            </cardItem>
                        </template>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup>
import Card from './Card.vue';
import cardItem from '@/components/CardItem/CardItem.vue';
import CardItemChart from '@/components/Charts/CardItemChart.vue';
import { groupUser } from '@/api/user'
import { groupByGarbage } from '@/api/garbage'
import { findTopFive } from '@/api/message';
import { onMounted, reactive, ref } from 'vue';

const topFive = ref([]);

const countList = reactive([
    {
        title: '用户统计',
        getData: async () => {
            const { group, total } = await groupUser();
            const dataSource = group.map(item => {
                if (item.userRank === 0)
                    item.userRank = '普通用户'
                else if (item.userRank === 1)
                    item.userRank = '配送者'
                else if (item.userRank === 2)
                    item.userRank = '管理员'
                return {
                    value: item.count,
                    name: item.userRank
                }
            })
            return {
                dataSource, total
            }
        }
    },
    {
        title: '废品统计',
        getData: async () => {
            const garbages = await groupByGarbage();
            console.log(garbages);
            const dataSource = garbages.map(item => {
                return {
                    value: item.garbageAmount,
                    name: item.categoryName
                }
            })
            const total = garbages.reduce((acc, cur) => acc + +cur.garbageAmount, 0)
            return {
                dataSource, total
            }
        }
    },
    {
        title: '评论统计',
        getData: async () => {
            const { group, total } = await groupUser();
            const dataSource = group.map(item => {
                if (item.userRank === 0)
                    item.userRank = '普通用户'
                else if (item.userRank === 1)
                    item.userRank = '配送者'
                else if (item.userRank === 2)
                    item.userRank = '管理员'
                return {
                    value: item.count,
                    name: item.userRank
                }
            })
            return {
                dataSource, total
            }
        }
    },
    {
        title: '订单统计', 
        getData: async () => {
            const { group, total } = await groupUser();
            const dataSource = group.map(item => {
                if (item.userRank === 0)
                    item.userRank = '普通用户'
                else if (item.userRank === 1)
                    item.userRank = '配送者'
                else if (item.userRank === 2)
                    item.userRank = '管理员'
                return {
                    value: item.count,
                    name: item.userRank
                }
            })
            return {
                dataSource, total
            }
        }
    },
])

const manageList = [
    { title: '消息管理', icon: '&#xe625;', to: { path: '/admin/manage', query: 1 } },
    { title: '评论管理', icon: '&#xe601;', to: { path: '/admin/manage', query: 2 } },
]

const setList = [
    { title: '系统', icon: '&#xe628;', to: { path: '/admin/systemset' } },
    { title: '锁定', icon: '&#xe626;', to: { path: '/admin/lockset' } },
]

const getTopFive = async () => {
    const data = await findTopFive()
    console.log(data);
    topFive.value = data
}

//请求数据
const requestData = async () => {
    countList.forEach(async (item) => {
        switch (item.title) {
            case '用户统计':
                break;
            case '废品统计':
                break;
            case '评论统计':
                break;
            case '评分统计':
                break;
        }
    })

}

onMounted(() => {
    getTopFive()
    requestData()
})
</script>

<style lang="scss" scoped>
.content {
    padding: 10px 20px;
    box-sizing: border-box;

    .admin {
        animation: show-move 0.6s linear;

        .header {
            text-align: center;
            padding: 14px;
            color: #5f676e;
            font-size: 17px;
            font-weight: 550;
            background: linear-gradient(135deg,
                    #1B1D23,
                    #52585d,
                    #c4cdc9);
            background-size: 200% 200%;
            border-radius: 5px;
            animation: gradient-move 4s ease-in-out infinite alternate;
            margin: 0 5px;
        }

        .card-box-top {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            padding-top: 20px;

            .card-item-container {
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
                    height: 250px;

                    h1 {
                        margin-top: 1rem;
                        font-size: 12px;
                        color: #8f959e;
                    }
                }
            }

            .card-message {
                width: 20vw;
                overflow: auto;

                &::-webkit-scrollbar {
                    display: none;
                }

            }
        }

        .card-box-bottom {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 20px 0;

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
</style>