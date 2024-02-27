<template>
    <div>
        <a-modal v-model:open="open" title="用户操作" :footer="null" centered>
            <a-form :model="formState" name="basic" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" autocomplete="off"
                @finish="onFinish" :rules="rules" ref="form">
                <a-form-item label="用户名" name="userName">
                    <a-input v-model:value="formState.userName" />
                </a-form-item>

                <a-form-item label="手机号" name="userPhone">
                    <a-input v-model:value="formState.userPhone" />
                </a-form-item>

                <a-form-item label="邮箱" name="userEmail">
                    <a-input v-model:value="formState.userEmail" />
                </a-form-item>

                <a-form-item label="地址" name="userAddress">
                    <a-input v-model:value="formState.userAddress" />
                </a-form-item>

                <a-form-item label="分级" name="userRank">
                    <a-radio-group v-model:value="formState.userRank" :options="userRankOptions" />
                </a-form-item>

                <a-form-item label="密码" name="userPass">
                    <a-input v-model:value="formState.userPass" />
                </a-form-item>

                <a-form-item label="确认密码" name="userPassAgain">
                    <a-input v-model:value="userPassAgain" />
                </a-form-item>

                <a-form-item :wrapper-col="{ offset: 8, span: 24 }">
                    <a-space>
                        <a-button @click="open = false">取消</a-button>
                        <a-button html-type="submit" type="primary">提交</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { register, updateUser } from '@/api/user'
import { message } from 'ant-design-vue';
import emitter from '@/utils/emitter';
const props = defineProps(['show', 'modalData'])

const userRankOptions = [
    { label: '普通用户', value: 0 },
    { label: '配送者', value: 1 },
    { label: '管理员', value: 2 },
]

const form = ref()
//上传表单
const formState = reactive({
    userName: '',
    userPhone: '',
    userEmail: '',
    userRank: '',
    userAddress: '',
    userPass: ''
})
const userPassAgain = ref('') //确认密码

//校验规则 密码校验
const validateUserPass = (rule, value) => {
    if (value.length > 10 || value.length < 5) {
        return Promise.reject('请输入5~10长度的任意字符')
    }
    return Promise.resolve()
}
//校验规则 重复密码校验
const validateUserPassAgain = (rule, value) => {
    if (userPassAgain.value !== formState.userPass) {
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
//校验规则 地址校验
const validateAddress = (rule, value) => {
    if (value.length < 1) {
        return Promise.reject('请输入正确地址');
    }
    return Promise.resolve();
};
//校验规则 邮箱校验
const validateEmail = (rule, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 邮箱正则表达式
    if (!emailRegex.test(value)) {
        return Promise.reject('请输入有效的邮箱');
    }

    return Promise.resolve();
};
//校验规则 分级校验
const validateRank = (rule, value) => {
    if (!value) {
        return Promise.reject('请确认用户分级');
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
    userPass: [{ required: true, validator: validateUserPass }],
    userPassAgain: [{ required: true, validator: validateUserPassAgain }],
    userPhone: [{ required: true, validator: validatePhone }],
    userEmail: [{ required: true, validator: validateEmail }],
    userRank: [{ required: true, validator: validateRank }],
    userAddress: [{ required: true, validator: validateAddress }],
}



const open = ref(false) //模态框显示
//控制模态框的显示与隐藏
watch(() => props.show, () => {
    open.value = true;
    Object.assign(formState, {
        userName: props.modalData.userName,
        userPhone: props.modalData.userPhone,
        userEmail: props.modalData.userEmail,
        userAddress: props.modalData.userAddress,
        userRank: props.modalData.userRank,
    })
})


const onFinish = async () => {
    try {
        await form.value.validateFields()
        if (props.modalData.userId) {
            try {
                await updateUser(props.modalData.userId, formState)
                message.success('修改成功')
                userPassAgain.value = ''
                formState.userPass = ''
            } catch (error) {
                message.error('修改失败')
            }
        } else {
            try {
                await register(formState.userEmail, formState.userPass, formState.userName, 
                formState.userPhone, formState.userAddress,formState.userRank)
                message.success('添加成功')
                userPassAgain.value = ''
                formState.userPass = ''
            } catch (error) {
                message.error('添加失败')
            }
        }
        emitter.emit('request-data-user')
        open.value = false;
    } catch (error) {
        return error
    }
}
</script>

<style lang="scss" scoped></style>