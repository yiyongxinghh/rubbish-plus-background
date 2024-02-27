import httpInstance from '@/utils/http';

/**
 * 获取所有分类
 * @returns 
 */
export const getCategory = (page = '', pageSize = '') => {
    return httpInstance({
        method: 'GET',
        url: '/category',
        params: {
            page,
            pageSize
        }
    })
}

/**
 * 删除单个分类
 * @param {*} id 
 * @returns 
 */
export const removeCategory = (id) => {
    return httpInstance({
        method: 'DELETE',
        url: `/category/${id}`
    })
}

/**
 * 获取分类中的废品总数
 * @returns 
 */
export const getCategoryCount = () => {
    return httpInstance({
        method: 'POST',
        url: '/category/categoryCount'
    })
}

/**
 * 创建分类
 * @param {*} data 
 * @returns 
 */
export const createCategory = (data) => {
    return httpInstance({
        method: 'POST',
        url: '/category',
        data
    })
}

/**
 * 修改指定分类
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updateCategory = (id, data) => {
    return httpInstance({
        method: 'PATCH',
        url: `/category/${id}`,
        data
    })
}

/**
 * 批量删除分类
 * @param {*} ids 
 */
export const deleteBatchCategory = (ids) => {
    return httpInstance({
        method: 'DELETE',
        url: '/category/',
        data: { ids }
    })
}   