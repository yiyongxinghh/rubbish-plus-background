<template>
    <div class="com-chart" ref="scoreRef"></div>
</template>

<script setup>
import { ref, reactive, shallowRef, onMounted, onBeforeUnmount } from 'vue'
import { findAllGarbageQuantity } from '@/api/garbage'
import { countStore } from '@/stores/countStore'
//引入总数仓库
const store = countStore()
//获取dom
const scoreRef = ref()

//图表实例
const chartInstance = shallowRef(null)

//数据源
let dataSource = reactive([])


//定时器
const timer = ref(null)
const totalPage = ref()
const currentPage = ref(0) //当前页数，默认为0

//定时器
const screenTimer = ref(null)

//屏幕适配参数
const titleFontSize = ref(0)

//初始化
const initChart = () => {
    chartInstance.value = echarts.init(scoreRef.value, 'black')
    chartInstance.value.setOption({
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
        },
        series: [
            {
                type: 'bar',
            },
        ],
        tooltip: {

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
    chartInstance.value.on('mouseover', () => { clearInterval(timer.value) })
    chartInstance.value.on('mouseout', () => { startInterval() })
}


/**
 * 视图更新
 */
const updateChart = () => {
    console.log(dataSource);
    const showData = dataSource.slice((currentPage.value - 1) * 5, currentPage.value * 5)
    console.log(showData);
    const sellerNames = showData.map((item) => {
        return item.garbageName
    })
    const sellervalues = showData.map((item) => {
        return item.totalQuantity
    })
    //渐变颜色数组
    const colors = [
        ['#1a1a2e', '#16213e'],
        ['#1c1c1c', '#29323c'],
        ['#0f0c29', '#302b63'],
        ['#2c3e50', '#4b79a1'],
        ['#232526', '#414345'],
    ]
    chartInstance.value.setOption({
        yAxis: {
            data: sellerNames
        },
        series: [
            {
                data: sellervalues,
                label: {
                    show: true,
                    formatter: (obj) => {
                        return obj.value
                    },
                    position: 'right',
                    color: '#fff'
                },
                itemStyle: {
                    color: (arg) => {
                        let targetColor = null
                        if (arg.value > 100) {
                            targetColor = colors[0]
                        } else if (arg.value > 200) {
                            targetColor = colors[1]
                        } else if (arg.value > 300) {
                            targetColor = colors[2]
                        } else if (arg.value > 400) {
                            targetColor = colors[3]
                        } else {
                            targetColor = colors[4]
                        }
                        return {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: targetColor[0] // 0% 处的颜色
                            }, {
                                offset: 1, color: targetColor[1] // 100% 处的颜色
                            }],
                        }
                    },
                }
            },
        ]
    })
}

//开启定时器
const startInterval = () => {
    if (timer.value) clearInterval(timer.value)
    timer.value = setInterval(() => {
        currentPage.value++
        if (currentPage.value > totalPage.value) {
            currentPage.value = 1
        }
        updateChart()
    }, 3000)
}

//屏幕适配
const screenAdapter = () => {
    titleFontSize.value = scoreRef.value.offsetWidth / 100 * 3.6
    chartInstance.value.setOption({
        series: [
            {
                barWidth: titleFontSize.value, //柱子宽度
                itemStyle: {
                    borderRadius: [0, titleFontSize.value / 2, titleFontSize.value / 2, 0] //（顺时针左上，右上，右下，左下）
                }
            },
        ]
    })
    chartInstance.value.resize()
}

/**
 * 定时器回调，当浏览器窗口发生像素差别很大的变化时，通过定时器不断的更新图表解决
 */
const screenAdapterimer = () => {
    screenAdapter()
    if (screenTimer.value) clearInterval(screenTimer.value)
    screenTimer.value = setTimeout(() => {
        screenAdapter()
    }, 10)
}

//获取数据
const getData = async () => {
    dataSource = await findAllGarbageQuantity()
    //每五个元素一页
    totalPage.value = dataSource.length % 5 === 0 ? dataSource.length / 5 : dataSource.length / 5 + 1
    store.garbageSaleTotalDataSource = dataSource
}

onMounted(() => {
    getData()
    initChart()
    startInterval()
    window.addEventListener('resize', screenAdapterimer)
    screenAdapter()
})

onBeforeUnmount(() => {
    clearInterval(timer.value, screenTimer.value)
    window.removeEventListener('resize', screenAdapterimer)
})
</script>

<style lang="scss" scoped></style>