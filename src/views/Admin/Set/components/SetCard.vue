<template>
    <div class="set-card">
        <div class="card-title">
            {{ title }}
        </div>
        <div class="card-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
defineProps(['title'])
</script>

<style scoped lang="scss">
.set-card {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .card-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
    }

    .card-content {
        padding: 20px;
    }
}
</style>