<template>
    <div>
        <a-modal v-model:open="open" title="分类操作" :footer="null" centered>
            <a-form :model="formState" name="basic" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" autocomplete="off"
                @finish="onFinish" ref="form">
                <a-form-item label="分类名称" name="categoryName"
                    :rules="[{ required: true, validator: validatorCategoryName }]">
                    <a-input v-model:value="formState.categoryName" />
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
import { ref, watch, reactive } from 'vue';
import { createCategory, updateCategory } from '@/api/category'
import { message } from 'ant-design-vue';
import emitter from '@/utils/emitter';
const props = defineProps(['show', 'modalData'])

const form = ref()

//表单数据
const formState = reactive({
    categoryName: ''
})

const validatorCategoryName = (rule, value) => {
    if (value === '') return Promise.reject('分类名称不能为空')
    return Promise.resolve()
}

//提交表单
const emit = defineEmits(['close'])

const open = ref(false) //模态框显示
//控制模态框的显示与隐藏
watch(() => props.show, () => {
    open.value = true;
    Object.assign(formState, {
        categoryName: props.modalData.categoryName,
    })
})

//提交表单
const onFinish = async () => {
    try {
        await form.value.validateFields()
        if (props.modalData.categoryId) {
            try {
                await updateCategory(props.modalData.categoryId, formState)
                message.success('修改成功')
                formState.categoryName = ''
            } catch (error) {
                message.error('修改失败')
            }
        } else {
            try {
                await createCategory(formState)
                message.success('添加成功')
                formState.categoryName = ''
            } catch (error) {
                message.error('添加失败')
            }
        }
        emitter.emit('request-data-category')
        open.value = false;
    } catch (error) {
        return error
    }
}
</script>

<style lang="scss" scoped></style>