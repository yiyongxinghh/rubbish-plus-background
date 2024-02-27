<template>
    <div>
        <a-drawer v-model:open="open" :title="modal" @close="handleOk" width="40%" style="backgroundColor:rgba(255,255,255,0.25)">
            <slot :name="modal"></slot>
        </a-drawer>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps(['open','modal'])
watch(() => props.open, () => {
    open.value = true;
})
const open = ref(false);
const handleOk = () => {
    open.value = false;
};
</script>

<style scoped></style>