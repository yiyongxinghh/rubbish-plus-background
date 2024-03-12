<template>
    <div class="card-content">
        <div class="title">
            <h1><i>|</i>{{ cardTitle }}</h1>
        </div>
        <slot></slot>
    </div>
</template>

<script setup>
defineProps(['cardTitle'])
</script>

<style lang="scss" scoped>
.card-content {
    border-radius: 10px;
    margin: 5px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.064);
    box-shadow: 1px 1px 3px black, inset 1px 1px 4px whitesmoke;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .title {
        margin: 14px 0 14px 10px;
        font-size: 18px;
        display: flex;
        align-items: center;

        h1 {
            color: white;

            i {
                font-size: 24px;
                font-weight: 1000;
                color: #00b96b;
                margin-right: 10px;
            }
        }
    }
}
</style>