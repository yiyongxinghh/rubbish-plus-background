import httpInstance from '@/utils/http'

/**
 * 获取评论分页数据
 * @param {*} page 
 * @param {*} pageSize 
 * @returns 
 */
export const getCommentList = (page = '', pageSize = '') => {
    return httpInstance({
        method: 'GET',
        url: '/comment',
        params: {
            page,
            pageSize
        }
    })
}

/**
 * 获取最热评论，自带分页
 * @param {*} page 
 * @param {*} pageSize 
 * @param {*} id 
 * @returns 
 */
export const getHotCommentList = (page = '', pageSize = '', id) => {
    return httpInstance({
        method: 'GET',
        url: '/comment/hot',
        params: {
            page,
            pageSize,
            id
        }
    })
}

/**
 * 获取最新评论，自带分页
 * @param {*} page 
 * @param {*} pageSize 
 * @param {*} id 
 * @returns 
 */
export const getNewCommentList = (page = '', pageSize = '', id) => {
    return httpInstance({
        method: 'GET',
        url: '/comment/new',
        params: {
            page,
            pageSize,
            id
        }
    })
}

/**
 * 获取指定时间范围的数据
 * @param {*} start 
 * @param {*} end 
 * @returns 
 */
export const getCommentTimed = (start, end) => {
    return httpInstance({
        method: 'POST',
        url: '/comment/time',
        data: {
            start,
            end
        }
    })
}