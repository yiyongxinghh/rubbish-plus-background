<template>
  <div>
    <a-modal v-model:open="open" title="基础操作" @ok="onFinish">
      <a-form
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        autocomplete="off"
        @finish="onFinish"
        ref="form"
      >
        <a-form-item
          label="上传"
          name="fileList"
          extra="如果您并非新增,此操作会替换原有图片,谨慎使用"
          :rules="[{ required: true, validator: validateFile }]"
        >
          <a-upload
            list-type="picture-card"
            :before-upload="beforeUpload"
            :max-count="1"
            v-model:file-list="fileList"
            accept="image/png, image/jpeg"
          >
            <div v-if="fileList.length == 0">
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div style="margin-top: 8px">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, watch,toRefs } from "vue";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import emitter from "@/utils/emitter";
import { upload,updatePic } from "@/api/pic";
const props = defineProps(["show", "pic"])
const state = toRefs(props)
const open = ref(false); //模态框显示
//控制模态框的显示与隐藏
watch(
  () => props.show,
  () => {
    open.value = true;
  }
);

//表单实例
const form = ref(null);

//文件源
let formData;
// 文件列表
const fileList = ref([]);
const loading = ref(false);

//文件校验规则
const validateFile = async (rule, value) => {
  if (fileList.value.length == 0) return Promise.reject("请上传图片");
  return Promise.resolve();
};

//上传前校验
const beforeUpload = (file) => {
  loading.value = true;
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  formData = new FormData();
  formData.append("file", file);
  console.log(formData, file);
  fileList.value = [file];
  loading.value = false;
  return false;
};

const onFinish = async () => {
  if (state.pic.value.picId) {
    console.log(state.pic.value);
    try {
      await updatePic(formData, state.pic.value.picId);
      open.value = false;
      message.success("修改成功");
    } catch (error) {
      message.error("修改失败");
    }
  } else {
    console.log(state.pic.value);
    try {
      await upload(formData);
      open.value = false;
      message.success("添加成功");
    } catch (error) {
      message.error("添加失败");
    }
  }
  emitter.emit('request-data-pic')
};
</script>

<style lang="scss" scoped></style>
