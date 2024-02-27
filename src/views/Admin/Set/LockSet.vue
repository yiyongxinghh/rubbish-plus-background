<template>
    <div class="content">
        <Banner />
        <div class="lock-set">
            <SetCard :title="route.meta.title">
                <a-form :model="formState" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }"
                    autocomplete="off">
                    <a-form-item label="用户名称" name="username" :colon="false" labelAlign="left">
                        <a-input-group compact>
                            <a-input v-model:value="store.userDate.userName" style="width: 80%" disabled />
                            <a-button @click="openDrawer('用户名称', 'userName')">
                                <SettingOutlined />设置
                            </a-button>
                        </a-input-group>
                    </a-form-item>

                    <a-form-item label="用户密码" name="password" :colon="false" labelAlign="left">
                        <a-input-group compact>
                            <a-input-password v-model:value="store.userDate.userPass" style="width: 80%"
                                :visibilityToggle="false" disabled />
                            <a-button @click="openDrawer('用户密码', 'userPass')">
                                <SettingOutlined />设置
                            </a-button>
                        </a-input-group>
                    </a-form-item>

                    <a-form-item label="用户邮箱" name="email" :colon="false" labelAlign="left">
                        <a-input-group compact>
                            <a-input v-model:value="store.userDate.userEmail" style="width: 80%" :visibilityToggle="false"
                                disabled />
                            <a-button @click="openDrawer('用户邮箱', 'userEmail')">
                                <SettingOutlined />设置
                            </a-button>
                        </a-input-group>
                    </a-form-item>

                    <a-form-item label="用户手机号" name="phone" :colon="false" labelAlign="left">
                        <a-input-group compact>
                            <a-input v-model:value="store.userDate.userPhone" style="width: 80%" :visibilityToggle="false"
                                disabled />
                            <a-button @click="openDrawer('用户手机号', 'userPhone')">
                                <SettingOutlined />设置
                            </a-button>
                        </a-input-group>
                    </a-form-item>

                </a-form>
            </SetCard>
        </div>
        <SetDrawer :handler="handler" :title="title" :name="name" :formState="formState">
            <template #userName="{form}"  >
                <a-form-item label="用户名称" name="userName" :colon="false" labelAlign="left" :label-col="{ span: 24 }">
                    <a-input v-model:value="form.userName" />
                </a-form-item>
            </template>
            <template #userPass="{form}"  >
                <a-form-item label="原密码" name="userOldPass" :colon="false" labelAlign="left" :label-col="{ span: 24 }">
                    <a-input v-model:value="form.userOldPass" :visibilityToggle="false" />
                </a-form-item>
                <a-form-item label="新密码" name="userPass" :colon="false" labelAlign="left" :label-col="{ span: 24 }">
                    <a-input v-model:value="form.userPass" :visibilityToggle="false" />
                </a-form-item>
                <a-form-item label="确认密码" name="userPassAgain" :colon="false" labelAlign="left" :label-col="{ span: 24 }">
                    <a-input v-model:value="form.userPassAgain" :visibilityToggle="false" />
                </a-form-item>
            </template>
            <template #userEmail="{form}"  >
                <a-form-item label="用户邮箱" name="userEmail" :colon="false" labelAlign="left" :label-col="{ span: 24 }">
                    <a-input v-model:value="form.userEmail"/>
                </a-form-item>
            </template>
            <template #userPhone="{form}"  >
                <a-form-item label="用户手机号" name="userPhone" :colon="false" labelAlign="left" :label-col="{ span: 24 }">
                    <a-input v-model:value="form.userPhone"/>
                </a-form-item>
            </template>
        </SetDrawer>
    </div>
</template>

<script setup>
import Banner from '@/components/Banner/Banner.vue'
import SetCard from './components/SetCard.vue'
import SetDrawer from './components/SetDrawer.vue'
import { SettingOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router'
import { userStore } from '@/stores/userStore'
import { reactive, ref } from 'vue';

const route = useRoute() //路由

const store = userStore() //用户信息

const handler = ref(false) //控制抽屉开关
const title = ref('') //抽屉标题
const name = ref('userName') //抽屉插槽名字

//表单数据
const formState = reactive({
    userId: store.userDate.userId,
    userName: store.userDate.userName,
    userPass: store.userDate.userPass,
    userEmail: store.userDate.userEmail,
    userPhone: store.userDate.userPhone
});
const userPassAgain = ref('') //确认密码


//开启抽屉，并传入标题和插槽名字
const openDrawer = (titleStr, nameStr) => {
    handler.value = !handler.value
    title.value = titleStr
    name.value = nameStr
}
</script>

<style lang="scss" scoped>
.content {
    padding: 10px 20px;
    box-sizing: border-box;

    .lock-set {
        width: 100%;
        padding: 10px 0;
    }
}
</style>