<template>
    <div class="foot-container">
        <div class="top-links">
            <ul class="links-list">
                <li>购物指南</li>
                <li><router-link to="/">购物流程</router-link></li>
                <li><router-link to="/">会员介绍</router-link></li>
                <li><router-link to="/">常见问题</router-link></li>
                <li><router-link to="/">联系客服</router-link></li>
            </ul>
            <ul class="links-list">
                <li>支付方式</li>
                <li><router-link to="/">货到付款</router-link></li>
                <li><router-link to="/">在线支付</router-link></li>
                <li><router-link to="/">分期付款</router-link></li>
            </ul>
            <ul class="links-list">
                <li>售后服务</li>
                <li><router-link to="/">售后政策</router-link></li>
                <li><router-link to="/">价格保护</router-link></li>
                <li><router-link to="/">退款说明</router-link></li>
                <li><router-link to="/">返修/退换货</router-link></li>
                <li><router-link to="/">取消订单</router-link></li>
            </ul>
            <ul class="links-list">
                <li>自营覆盖区县</li>
                <li><router-link to="/">常见问题</router-link></li>
                <li><router-link to="/">服务</router-link></li>
                <li><router-link to="/">查看详情</router-link></li>
            </ul>
        </div>
        <!-- 分割线 -->
        <div class="line"></div>
        <!-- 底部链接 -->
        <div class="bottom-links">
            <ul class="bottom-links-list">
                <li><a href="#">关于我们</a></li>
                <li><a href="#">联系我们</a></li>
                <li><a href="#">合作招商</a></li>
            </ul>
            <div class="copyright">Copyright 2023 © Garbage collection system.</div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.foot-container {
    background: #000;

    .top-links {

        display: flex;
        justify-content: space-around;
        padding: 20px;

        .links-list {
            li {
                color: white;
                font-size: 20px;
                padding: 5px;

                a {
                    color: #7E8C8D;
                    font-size: 16px;
                }
            }
        }
    }

    .line {
        width: 80%;
        height: 1px;
        margin: 10px auto;
        background-color: #7E8C8D;
    }

    .bottom-links {
        .bottom-links-list {
            display: flex;
            justify-content: center;

            li {
                padding: 0 10px;

                a {
                    color: #7E8C8D;
                }

            }
        }

        .copyright {
            padding: 10px;
            text-align: center;
            color: white;
        }
    }
}
</style>