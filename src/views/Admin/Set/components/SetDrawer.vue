<template>
    <a-drawer v-model:open="open" :title="title" class="custom-class" root-class-name="root-class-name" title=""
        placement="right">
        <a-form :model="formState" :rules="rules" autocomplete="off" ref="form">
            <slot :name="name" :form="formState"></slot>
        </a-form>
        <template #footer>
            <div class="space">
                <a-space>
                    <a-button type="primary" @click="confirm">确定</a-button>
                    <a-button @click="open = false">取消</a-button>
                </a-space>
            </div>
        </template>
    </a-drawer>
</template>

<script setup>
import { ref, reactive, watch, createVNode } from 'vue';
import { updateUserOne } from '@/api/user';
import { Modal, message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'
import { userStore } from '@/stores/userStore'
const props = defineProps(['handler', 'title', 'name', 'formState'])
const open = ref(false);

const router = useRouter()
const store = userStore()

const form = ref()

//上传表单
const formState = reactive({
    userId: props.formState.userId,
    userName: props.formState.userName,
    userPhone: props.formState.userPhone,
    userEmail: props.formState.userEmail,
    userOldPass: '',
    userPass: '',
    userPassAgain: ''
})

watch(() => props.handler, () => {
    open.value = true
})

//确定提交
const confirm = async () => {
    try {
        await form.value.validateFields()
        Modal.confirm({
            title: `修改${props.title}`,
            icon: createVNode(ExclamationCircleOutlined),
            content: `修改${props.title}将退出登陆，是否继续？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                const response = await updateUserOne({
                    data: formState[props.name], type: props.name,
                    userId: formState.userId, userOldPass:formState.userOldPass })
                console.log(response);
                if (response.isUpdata) {
                    message.success({
                        content: `${props.title}-${response.message}`,
                        duration: 3,
                    })
                    store.clearUserData()
                    store.clearToken()
                    router.push('/login')
                } else {
                    message.error({
                        content: `${props.title}-${response.message}`,
                        duration: 3,
                    })
                }

                open.value = false
            }
        });
    } catch (error) {
        return error
    }
}
//校验规则 密码校验
const validateUserPass = (rule, value) => {
    if (value.length > 10 || value.length < 5) {
        return Promise.reject('请输入5~10长度的任意字符')
    }
    return Promise.resolve()
}
//校验规则 重复密码校验
const validateUserPassAgain = (rule, value) => {
    if (formState.userPassAgain !== formState.userPass) {
        return Promise.reject('密码匹配不成功')
    }
    return Promise.resolve()
}
//校验规则 用户名校验
const validateUserName = (rule, value) => {
    if (value.length > 10 || value.length < 5) {
        return Promise.reject('请输入5~10长度的任意字符')
    }
    return Promise.resolve()
}
//校验规则 邮箱校验
const validateEmail = (rule, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 邮箱正则表达式
    if (!emailRegex.test(value)) {
        return Promise.reject('请输入有效的邮箱');
    }

    return Promise.resolve();
};
//校验规则 手机号校验
const validatePhone = (rule, value) => {
    const phoneRegex = /^[1-9]\d{10}$/; // 手机号正则表达式
    if (!phoneRegex.test(value)) {
        return Promise.reject('请输入有效的手机号');
    }
    return Promise.resolve();
};
const rules = {
    userName: [{ required: true, validator: validateUserName }],
    userOldPass: [{ required: true, validator: validateUserPass }],
    userPass: [{ required: true, validator: validateUserPass }],
    userPassAgain: [{ required: true, validator: validateUserPassAgain }],
    userPhone: [{ required: true, validator: validatePhone }],
    userEmail: [{ required: true, validator: validateEmail }],
}
</script>

<style scoped lang="scss">
.space {
    display: flex;
    justify-content: end;
}
</style>