<template>
    <div class="com-chart" ref="pieRef"></div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, reactive } from 'vue'
import { getCategoryCount } from '@/api/category'
import { countStore } from '@/stores/countStore'
//引入总数仓库
const store = countStore()

//获取dom
const pieRef = ref()

//图表实例
const chartInstance = shallowRef(null)

//屏幕适配参数
const titleFontSize = ref(0)

//适配定时器
const screenTimer = ref(null)

//数据源
let dataSource = reactive([])


//初始化
const initChart = () => {
    chartInstance.value = echarts.init(pieRef.value, 'black')
    chartInstance.value.setOption({
        legend: {
            bottom: '5%',
            right: '5%',
            orient: 'vertical',
            textStyle: {
                color: '#fff'
            },
        },
        series: [
            {
                type: 'pie',
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontWeight: 'bold'
                    }
                }
            }
        ],
        tooltip: {
            trigger: 'item'
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
    titleFontSize.value = pieRef.value.offsetWidth / 100 * 3.6
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
                radius: [titleFontSize.value * 4, titleFontSize.value * 6],
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
        series: [
            {
                data: dataSource.map(item => {
                    return {
                        value: item.count,
                        name: item.categoryName
                    }
                }),
                label: {
                    color: '#fff'
                }
            },
        ]
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

const getData = async ()=>{
    dataSource = await getCategoryCount()
    store.categoryTotalDataSource = dataSource
}

onMounted(async () => {
    await getData()
    initChart()
    updateChart()
    window.addEventListener('resize', screenAdapterimer)
    screenAdapter()
})

onBeforeUnmount(() => {
    clearInterval(screenTimer.value)
    window.removeEventListener('resize', screenAdapterimer)
})
</script>

<style lang="scss" scoped></style>