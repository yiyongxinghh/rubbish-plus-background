<template>
    <div class="main-container">
        <Nav></Nav>
        <div class="main-container-item">
            <Header></Header>
            <Content v-if="route.path === '/admin'"></Content>
            <router-view v-else></router-view>
            <!-- <Footer></Footer> -->
        </div>
    </div>
</template>

<script setup>
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
import Content from './Home/Components/Content.vue'
import Nav from './Home/Components/Nav.vue';
import { useRoute } from 'vue-router'
const route = useRoute()

</script>

<style lang="scss" scoped>
.main-container {
    display: flex;
    height: 100vh;
    background: linear-gradient(to right, #0c0c0c, #1f1f1f, #383838, #555555, #000000);
    overflow: hidden;
    .main-container-item {
        display: flex;
        flex-direction: column;
        flex-grow:1 ;
    }
}
</style>
