import httpInstance from '@/utils/http'

/**
 * 获取消息分页数据
 * @param {*} page 
 * @param {*} pageSize 
 * @returns 
 */
export const getMessageList = (page='',pageSize='',senderId,recipientId) => {
    return httpInstance({
        method:'GET',
        url: '/message',
        params: {
            page,
            pageSize,
            senderId,
            recipientId
        }
    })
}


/**
 * 获取指定时间范围的数据
 * @param {*} start 
 * @param {*} end 
 * @returns 
 */
export const getMessageTimed = (start,end) => { 
    return httpInstance({
        method:'POST',
        url: '/message/time',
        data: {
            start,
            end
        }
    })
}

/**
 * 获取最新消息前五条
 * @returns 
 */
export const findTopFive = ()=>{
    return httpInstance({
        method:'POST',
        url: '/message/topFive'
    })
}