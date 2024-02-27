import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const countStore = defineStore('countStore', () => {

    //分类总数数据源
    const categoryTotalDataSource = ref({})

    //废品总数数据源
    const garbageAmountTotalDataSource = ref({})

    //废品销量总数数据源
    const garbageSaleTotalDataSource = ref({})

    //评论和留言数据源
    const commentAndMessageDataSource = ref({})

    return {
        categoryTotalDataSource,
        garbageAmountTotalDataSource,
        garbageSaleTotalDataSource,
        commentAndMessageDataSource,
    }
})