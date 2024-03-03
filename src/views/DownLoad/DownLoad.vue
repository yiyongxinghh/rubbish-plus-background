<template>
    <div class="content">
        <BackGround />
        <div class="content-box">
            <div class="content-title">
                <div class="icon">
                    <img src="@/assets/img/rubbish-white.png" />
                    <h1>rubbish-plus</h1>
                </div>
                <ul class="conten-list">
                    <li>首页</li>
                    <li>详情</li>
                    <li>更多</li>
                    <li>登出</li>
                </ul>
            </div>
            <div class="content-main">
                <h1 id="title"></h1>
                <div class="content-download">
                    <button class="ios">IOS安装包下载</button>
                    <button class="and">Android安装包下载</button>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script setup>
//引入打字库
import Typed from 'typed.js';
import BackGround from "@/components/BackGround/BackGround.vue";
import Footer from '@/components/Footer/Footer.vue';
import { onMounted } from 'vue';

//开启自动打字
const typing = () => {
    new Typed('#title', {
        strings: ['Welcome to rubbish-puls.', '欢迎使用废品回收系统.'],
        typeSpeed: 50,
        loop: true,
        smartBackspace: true,
        backSpeed: 50,
        autoInsertCss: true
    });
}

onMounted(() => {
    typing()
})
</script>

<style scoped lang='scss'>
.content {
    position: relative;

    .content-box {
        user-select: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        .content-title {
            display: flex;
            height: 96px;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            background: rgba(0, 0, 0, 0.5);
            font-family: 'Roboto', sans-serif;

            .icon {
                display: flex;
                align-items: center;

                img {
                    width: 68px;
                }

                h1 {

                    color: #fff;
                    font-size: 36px;
                    font-weight: 500;
                    margin-left: 20px;
                }
            }

            .conten-list {
                display: flex;
                align-items: center;
                height: 100%;

                li {
                    height: 100%;
                    line-height: 56px;
                    color: #fff;
                    font-size: 22px;
                    font-weight: 500;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.1s ease-in-out;

                    &:hover {
                        border-bottom: 5px solid #fff;
                        background: rgb(0, 0, 0);
                        ;
                    }
                }
            }

        }

        .content-main {
            display: flex;
            height: 50vh;
            justify-content: space-evenly;
            align-items: center;
            margin-top: 100px;
            flex-direction: column;

            #title {
                height: 50px;
                font-size: 46px;
                font-weight: bolder;
                color: #fff;
            }

            .content-download {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-evenly;

                button {
                    border-radius: 20px;
                    cursor: pointer;
                    outline: none;
                    border: 0;
                    width: 270px;
                    height: 70px;
                    font-size: 28px;
                    background-color: rgba(0, 0, 0, 0.6);
                    color: #fff;
                    position: relative;

                    &.ios {
                        &:hover {
                            &::after {
                                position: absolute;
                                border-radius: 20px;
                                content: "";
                                top: 0;
                                bottom: 0;
                                left: 0;
                                right: 0;
                                background-image: url("@/assets/img/ios.png");
                                background-color: #000;
                                background-size: contain;
                                background-repeat: no-repeat;
                                background-position: center;
                            }
                        }
                    }
                    &.and {
                        &:hover {
                            &::after {
                                position: absolute;
                                border-radius: 20px;
                                content: "";
                                top: 0;
                                bottom: 0;
                                left: 0;
                                right: 0;
                                background-image: url("@/assets/img/and.png");
                                background-color: #000;
                                background-size: contain;
                                background-repeat: no-repeat;
                                background-position: center;
                            }
                        }
                    }


                }
            }
        }
    }
}
</style>