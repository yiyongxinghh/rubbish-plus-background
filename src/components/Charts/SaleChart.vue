<template>
  <div class="com-chart" ref="saleRef"></div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, watch, toRef } from "vue";
const props = defineProps(["showList"]);

const data = toRef(props, "showList");
console.log(data.value);

//获取dom
const saleRef = ref();

//图表实例
const chartInstance = shallowRef(null);

//屏幕适配参数
const titleFontSize = ref(0);

//适配定时器
const screenTimer = ref(null);

//初始化
const initChart = () => {
  chartInstance.value = echarts.init(saleRef.value, "black");
  chartInstance.value.setOption({
    xAxis: {
      type: "category",
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          width: 0.5,
        },
      },
    },
    tooltip: {
      show: true,
      trigger: "axis",
    },
    series: [
      {
        type: "line",
      },
    ],
    dataZoom: [{}],
    legend: {
      icon: "circle",
    },
    toolbox: {
      show: true,
      left: "2%",
      feature: {
        saveAsImage: {
          title: "保存为图片",
        },
      },
    },
  });
};

//屏幕适配
const screenAdapter = () => {
  titleFontSize.value = (saleRef.value.offsetWidth / 100) * 3.6;
  chartInstance.value.setOption({
    legend: {
      itemWidth: titleFontSize.value,
      itemHeight: titleFontSize.value,
      textStyle: {
        fontSize: titleFontSize.value / 2,
      },
    },
    series: [
      {
        emphasis: {
          label: {
            fontSize: titleFontSize.value,
          },
        },
      },
    ],
  });
  chartInstance.value.resize();
};

//视图更新
const updateChart = async () => {
  chartInstance.value.setOption({
    xAxis: {
      data: data.value.map((item) => item.currentDate),
    },
    series: [
      {
        data: data.value.map((item) => item.garbageQuantity),
      },
    ],
  });
};
watch(
  () => data.value,
  () => {
    updateChart()
  },
  { deep: true }
);

/**
 * 定时器回调，当浏览器窗口发生像素差别很大的变化时，图表的比例会出现问题，通过定时器不断的更新图表解决
 */
const screenAdapterimer = () => {
  screenAdapter();
  if (screenTimer.value) clearInterval(screenTimer.value);
  screenTimer.value = setTimeout(() => {
    screenAdapter();
  }, 10);
};

onMounted(async () => {
  initChart();
  updateChart();
  window.addEventListener("resize", screenAdapterimer);
  screenAdapter();
});

onBeforeUnmount(() => {
  clearInterval(screenTimer.value);
  window.removeEventListener("resize", screenAdapterimer);
});
</script>

<style scoped lang="scss"></style>
