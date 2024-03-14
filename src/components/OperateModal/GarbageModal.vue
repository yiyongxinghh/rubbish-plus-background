<template>
    <div>
        <a-modal v-model:open="open" title="基础操作" :footer="null" centered>
            <a-form :model="formState" name="basic" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" autocomplete="off"
                @finish="onFinish" ref="form">
                <a-form-item label="废品名" name="garbageName"
                    :rules="[{ required: true, message: 'Please input your garbageName!' }]">
                    <a-input v-model:value="formState.garbageName" />
                </a-form-item>

                <a-form-item label="废品类型" name="garbageType"
                    :rules="[{ required: true, message: 'Please input your garbageType!' }]">
                    <a-input v-model:value="formState.garbageType" />
                </a-form-item>

                <a-form-item label="废品库存" name="garbageAmount"
                    :rules="[{ required: true, message: 'Please input your garbageAmount!' }]">
                    <a-input-number :min="min" :max="max" v-model:value="formState.garbageAmount" />
                </a-form-item>

                <a-form-item label="废品金额" name="garbagePrice"
                    :rules="[{ required: true, message: 'Please input your garbagePrice!' }]">
                    <a-input-number :min="min" :max="max" v-model:value="formState.garbagePrice" />
                </a-form-item>

                <a-form-item label="废品描述" name="garbageDescription"
                    :rules="[{ required: true, message: 'Please input your garbageDescription!' }]">
                    <a-textarea v-model:value="formState.garbageDescription"
                        placeholder="Autosize height with minimum and maximum number of lines"
                        :auto-size="{ minRows: 2, maxRows: 5 }" />
                </a-form-item>

                <a-form-item v-if="!modalData.garbageId" label="上传" name="fileList"
                    :rules="[{ required: true, validator: validateFile, }]">
                    <a-upload list-type="picture-card" :before-upload="beforeUpload" :max-count="1"
                        v-model:file-list="fileList" accept="image/png, image/jpeg">
                        <div v-if="fileList.length == 0">
                            <loading-outlined v-if="loading"></loading-outlined>
                            <plus-outlined v-else></plus-outlined>
                            <div style="margin-top: 8px">Upload</div>
                        </div>
                    </a-upload>
                </a-form-item>

                <a-form-item label="所属人" name="user" :rules="[{ required: true, message: 'Please input your user!' }]">
                    <a-select v-model:value="userOption" placeholder="Please select" :options="userOptions" allow-clear
                        show-search></a-select>
                </a-form-item>

                <a-form-item label="所属分类" name="category"
                    :rules="[{ required: true, message: 'Please input your category!' }]">
                    <a-select v-model:value="categoryOption" placeholder="Please select" :options="categoryOptions"
                        allow-clear show-search></a-select>
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
import { ref, watch, reactive, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { addGarbage, updateGarbage } from '@/api/garbage';
import { findAllUser } from '@/api/user';
import { upload } from '@/api/pic'
import { getCategory } from '@/api/category';
import emitter from '@/utils/emitter';
const props = defineProps(['show', 'modalData'])
const form = ref()

const min = 1 //最低限制
const max = 9999 //最高限制

const loading = ref(false)  //加载
const fileList = ref([]);

const userOption = computed({
    get() {
        if (formState.user) {
            if (formState.user instanceof Object) return formState.user.userId
            else return formState.user
        } else return []
    },
    set(value) {
        formState.user = value
    }
})
const categoryOption = computed({
    get() {
        if (formState.category ) {
            if (formState.category instanceof Object) return formState.category.categoryId
            else return formState.category
        } else return []
    },
    set(value) {
        formState.category = value
    }
})

//表单
const formState = reactive({
    garbageName: props.modalData.garbageName,
    garbageType: props.modalData.garbageType,
    garbagePrice: props.modalData.garbagePrice,
    garbageAmount: props.modalData.garbageAmount,
    garbageDescription: props.modalData.garbageDescription,
    user: props.modalData.user,
    category: props.modalData.category,
});

let formData //文件源

//文件校验规则
const validateFile = async (rule, value) => {
    if (fileList.value.length == 0) return Promise.reject('请上传图片')
    return Promise.resolve()
}

//所属人
let userOptions = reactive([]);
//所属分类
let categoryOptions = reactive([]);

const open = ref(false);
//控制模态框的显示与隐藏
watch(() => props.show, () => {
    open.value = true;
    Object.assign(formState, {
        garbageName: props.modalData.garbageName,
        garbageType: props.modalData.garbageType,
        garbagePrice: props.modalData.garbagePrice,
        garbageAmount: props.modalData.garbageAmount,
        garbageDescription: props.modalData.garbageDescription,
        user: props.modalData.user,
        category: props.modalData.category,
    });
}
)

//上传前校验
const beforeUpload = (file) => {
    loading.value = true
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    formData = new FormData();
    formData.append('file', file);
    console.log(formData, file);
    fileList.value = [file];
    loading.value = false
    return false;
};

//模态框的确定按钮的回调
const onFinish = async () => {
    try {
        await form.value.validateFields();
        if (props.modalData.garbageId) {
            try {
                await updateGarbage(props.modalData.garbageId, { ...formState, pic: props.modalData.pic.picId })
                message.success('修改成功')
            } catch (error) {
                message.error('修改失败')
            }
        } else {
            try {
                let picId = await upload(formData)
                console.log(picId.identifiers[0]);
                await addGarbage({ ...formState, pic: picId.identifiers[0].picId })
                message.success('添加成功')
            } catch (error) {
                message.error('添加失败')
            }
        }
        formData = null
        emitter.emit('request-data-garbage')
        open.value = false;
    } catch (error) {
        return error
    }
}

onMounted(async () => {
    userOptions = (await findAllUser()).users.map(item =>
    ({
        label: item.userName,
        value: item.userId
    }))
    categoryOptions = (await getCategory()).category.map(item =>
    ({
        label: item.categoryName,
        value: item.categoryId
    }))
})
</script>

<style lang="scss" scoped></style>
