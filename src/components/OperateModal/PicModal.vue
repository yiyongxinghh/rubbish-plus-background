<template>
    <div>
        <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </a-modal>
    </div>
</template>

<script setup>
import { ref,watch } from 'vue';
const props = defineProps(['show'])
const open = ref(false) //模态框显示
//控制模态框的显示与隐藏
watch(() => props.show, () => {
    open.value = true;
})
const handleOk = ()=>{

}
</script>

<style lang="scss" scoped></style>