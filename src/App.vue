<script setup>
import { userStore } from '@/stores/userStore'
//引入socket
import { socket } from '@/utils/socket'
import { onMounted } from 'vue';
//仓库
const store = userStore();

onMounted(() => {
  //发送本地用户消息
  socket.emit('onload', { userId: store.userDate.userId })
})

</script>

<template>
  <a-config-provider :theme="{
    token: {
      wireframe: false,
      colorPrimary: '#252525',
      colorInfo: '#ffffff'
    },
    components: {
      Steps: {
        colorTextLabel: '#ffffff'
      },
      Table: {
        colorBgContainer: 'rgba(0,0,0,0.95)',
        colorBorderSecondary: '#7E8C8D',
        colorText: '#ffffff',
        colorFillAlter: '#252525',
        colorTextHeading: '#ffffff',
        fontSize: 17,
        fontWeightStrong: 1000
      },
      Pagination: {
        colorPrimar: '#7E8C8D',
        colorPrimaryHover: '#7E8C8D',
        colorText: '#ffffff',
        colorTextDisabled: '#7E8C8D',
      },
      Select: {
        colorPrimary: '#7E8C8D',
        colorPrimaryHover: '#7E8C8D'
      },
      Tabs: {
        colorPrimary: '#ffffff',
        colorText: '#ffffff'
      },
      List: {
        colorText: '#ffffff',
        colorSplit: 'rgba(255,255,255,0.2)',
        colorBorder: 'rgba(255,255,255,0.2)',
        colorTextDescription: 'rgba(255,255,255,0.5)',
      },
      Button: {
        colorError: '#7E8C8D'
      },
      Card: {
        colorPrimary: '#ffffff',
        colorBgContainer: 'rgba(255,255,255,0.3)'
      },
    }
  }">
  </a-config-provider>

  <router-view></router-view>
</template>

<style scoped lang="scss"></style>