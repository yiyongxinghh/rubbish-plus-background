<template>
    <div class="com-chart" ref="barRef"></div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, reactive } from 'vue'
import { getGarbage } from '@/api/garbage'
import { countStore } from '@/stores/countStore'
//引入总数仓库
const store = countStore()

//获取dom
const barRef = ref()

//数据源
let dataSource = reactive([])
//修正后的数据
let data

//图表实例
const chartInstance = shallowRef(null)

//定时器
const timer = ref(null)
const startValue = ref(0)
const endValue = ref(2)

//适配定时器
const screenTimer = ref(null)

//屏幕适配参数
const titleFontSize = ref(0)

//初始化
const initChart = () => {
    chartInstance.value = echarts.init(barRef.value, 'black')
    chartInstance.value.setOption({
        yAxis: {
            type: 'value'
        },
        xAxis: {
            type: 'category',
        },
        series: [
            {
                type: 'bar',
            },
        ],
        tooltip: {
            show: true
        },
        toolbox: {
            show: true,
            left: '2%',
            feature: {
                saveAsImage: {
                    title:'保存为图片'
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
    //渐变颜色数组
    const colors = [
        ['#1a1a2e', '#16213e'],
        ['#1c1c1c', '#29323c'],
        ['#0f0c29', '#302b63'],
        ['#2c3e50', '#4b79a1'],
        ['#232526', '#414345'],
    ]
    chartInstance.value.setOption({
        dataZoom: [
            {
                show: false,
                startValue: startValue.value,
                endValue: endValue.value
            }
        ],
        xAxis: {
            data: dataSource.garbages.map(item => item.garbageName)
        },
        tooltip: {
            formatter: (obj) => {
                return `
                    <div style="background-color: rgba(255, 255, 255, 0.8);">
                        <div style="font-weight: bold; font-size: 18px;display:flex;align-items:center;">
                            <div style="background-color:${obj.color.colorStops[1].color};border-radius: 50%;width:10px;height:10px;margin-right:10px"></div>
                            <div>${obj.name}</div>
                        </div>
                        <div style="font-size: 12px;">总数: ${obj.value}</div>
                        <div style="font-size: 12px;">评分: ${obj.data.score}</div>
                        <div style="font-size: 12px;">类别: ${obj.data.type}</div>
                        <div style="font-size: 12px;">分类: ${obj.data.category}</div>
                        <div style="font-size: 12px;">所属人: ${obj.data.user}</div>
                    </div>
                    `;
            },
        },
        series: [
            {
                data: data,
                label: {
                    show: true,
                    formatter: (obj) => {
                        return obj.value
                    },
                    position: 'top',
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
        ],
    })
}

//开启定时器
const startInterval = () => {
    if (timer.value) clearInterval(timer.value)
    timer.value = setInterval(() => {
        if (endValue.value >= dataSource.total) { startValue.value = 0; endValue.value = 2 }
        updateChart()
        startValue.value++
        endValue.value++
    }, 2000)
}

//屏幕适配
const screenAdapter = () => {
    titleFontSize.value = barRef.value.offsetWidth / 100 * 3.6
    chartInstance.value.setOption({
        series: [
            {
                barWidth: titleFontSize.value, //柱子宽度
                itemStyle: {
                    borderRadius: [titleFontSize.value / 2, titleFontSize.value / 2, 0, 0] //（顺时针左上，右上，右下，左下）
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

const getData = async ()=>{
    dataSource = await getGarbage()
    store.garbageAmountTotalDataSource = dataSource
}

onMounted(async () => {
    await getData()
    data = dataSource.garbages.map((item) => {
        return {
            name: item.garbageName,
            value: item.garbageAmount,
            type: item.garbageType,
            category: item.category.categoryName,
            score: item.garbageScore,
            user:item.user.userName
        }
    })
    initChart()
    startInterval()
    window.addEventListener('resize', screenAdapterimer)
    screenAdapter()
})

onBeforeUnmount(() => {
    clearInterval(timer.value,screenTimer.value)
    window.removeEventListener('resize', screenAdapterimer)
})
</script>

<style lang="scss" scoped>

</style>