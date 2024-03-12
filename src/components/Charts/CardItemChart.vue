<template>
  <div class="com-chart" ref="cardRef"></div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, watch } from "vue";
const { dataSource } = defineProps(["dataSource"]);
//获取dom
const cardRef = ref();

//图表实例
const chartInstance = shallowRef(null);

//屏幕适配参数
const titleFontSize = ref(0);

//适配定时器
const screenTimer = ref(null);

//初始化
const initChart = () => {
  chartInstance.value = echarts.init(cardRef.value, "black");
  chartInstance.value.setOption({
    series: [
      {
        type: "pie",
        avoidLabelOverlap: false,
        radius: ["100%", "90%"],
        label: {
          show: true,
          position: "center",
          color: "#737373",
        },
        legend: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
        },
      },
    ],
    tooltip: {
      trigger: "item",
    },
  });
};

//屏幕适配
const screenAdapter = () => {
  titleFontSize.value = (cardRef.value.offsetWidth / 100) * 3.6;
  cardRef.value.style.height = titleFontSize.value * 50 + "px";

  chartInstance.value.setOption({
    series: [
      {
        label: {
          fontSize: titleFontSize.value * 4,
        },
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
  const data = await dataSource;
  chartInstance.value.setOption({
    series: [
      {
        data: data.dataSource,
        label: {
          formatter: () => {
            return `${data.total}`;
          },
        },
      },
    ],
  });
};

/**
 * 定时器回调，当浏览器窗口发生像素差别很大的变化时，图表的比例会出现问题，通过定时器不断的更新图表解决
 */
const screenAdapterimer = () => {
  screenAdapter();
  if (screenTimer.value) clearInterval(screenTimer.value);
  screenTimer.value = setTimeout(() => {
    screenAdapter();
  }, 100);
};

onMounted(async () => {
  initChart();
  updateChart();
  screenAdapterimer();
  window.addEventListener("resize", screenAdapterimer);
});

onBeforeUnmount(() => {
  clearInterval(screenTimer.value);
  window.removeEventListener("resize", screenAdapterimer);
});
</script>

<style scoped lang="scss"></style>
