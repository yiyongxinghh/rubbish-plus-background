<template>
    <div class="com-chart" ref="messageRef"></div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, reactive } from 'vue'
import { getMessageTimed } from '@/api/message'
import { getCommentTimed } from '@/api/comment'
import dayjs from 'dayjs'
import { countStore } from '@/stores/countStore'
//引入总数仓库
const store = countStore()

//获取dom
const messageRef = ref()

//图表实例
const chartInstance = shallowRef(null)

//屏幕适配参数
const titleFontSize = ref(0)

//适配定时器
const screenTimer = ref(null)

//定时器
const timer = ref(null)
//计时秒数
const time = ref(5)
const startValue = ref(0)
const endValue = ref(6)

//x轴数据源
const xAxisData = reactive([])
//数据源
const commentData = []
const messageData = []
let series = reactive([])


//初始化
const initChart = () => {
    chartInstance.value = echarts.init(messageRef.value, 'black')
    chartInstance.value.setOption({
        xAxis: {
            type: 'category'
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: "dashed",
                    width: 0.5
                }
            }
        },
        tooltip: {
            show: true,
            trigger: 'axis'
        },
        series: [{
            type: 'line'
        }],
        dataZoom: [{

        }],
        legend: {
            icon: "circle"
        },
        toolbox: {
            show: true,
            left: '2%',
            feature: {
                saveAsImage: {
                    title: '保存为图片'
                }
            }
        }
    })
}

//屏幕适配
const screenAdapter = () => {
    titleFontSize.value = messageRef.value.offsetWidth / 100 * 3.6
    chartInstance.value.setOption({
        legend: {
            itemWidth: titleFontSize.value,
            itemHeight: titleFontSize.value,
            textStyle: {
                fontSize: titleFontSize.value / 2
            },
        },
        series: [
            {
                emphasis: {
                    label: {
                        fontSize: titleFontSize.value,
                    }
                }
            },
        ]
    })
    chartInstance.value.resize()
}


//视图更新
const updateChart = async () => {
    chartInstance.value.setOption({
        xAxis: {
            data: xAxisData
        },
        series: series,
        legend: {
            data: ['评论', '消息']
        },
    })
}

/**
 * 定时器回调，当浏览器窗口发生像素差别很大的变化时，图表的比例会出现问题，通过定时器不断的更新图表解决
 */
const screenAdapterimer = () => {
    screenAdapter()
    if (screenTimer.value) clearInterval(screenTimer.value)
    screenTimer.value = setTimeout(() => {
        screenAdapter()
    }, 10)
}

//开启定时器
const startInterval = () => {
    if (timer.value) clearInterval(timer.value)
    timer.value = setInterval(async () => {
        endValue.value++
        startValue.value++
        await getData()
        updateChart()
    }, time.value * 1000)
}

//获取数据
const getData = async () => {
    const now = dayjs(); // 创建一个Day.js对象，表示当前时间
    const before = now.subtract(time.value, 'second');
    const nowTime = now.format('YYYY-MM-DD HH:mm:ss')
    const beforeTime = before.format('YYYY-MM-DD HH:mm:ss')
    console.log(beforeTime, nowTime);
    const commentList = await getCommentTimed(beforeTime, nowTime)
    const messageList = await getMessageTimed(beforeTime, nowTime)
    store.commentAndMessageDataSource = { commentList, messageList }
    xAxisData.push(now.format('HH:mm:ss'))
    commentData.push(commentList.length)
    messageData.push(messageList.length)
    const commentSeries = {
        type: 'line',
        smooth: false,
        name: '评论',
        data: commentData
    }

    const messageSeries = {
        type: 'line',
        smooth: false,
        name: '消息',
        data: messageData
    }
    series = [commentSeries, messageSeries]
    console.log(commentList, messageList, xAxisData, commentSeries, messageSeries, series);

}

onMounted(async () => {
    initChart()
    startInterval()
    await getData()
    window.addEventListener('resize', screenAdapterimer)
    screenAdapter()
})

onBeforeUnmount(() => {
    clearInterval(timer.value, screenTimer.value)
    window.removeEventListener('resize', screenAdapterimer)
})
</script>

<style lang="scss" scoped></style>