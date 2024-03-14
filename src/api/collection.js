import httpInstance from '@/utils/http';

/**
 * 根据指定废品id，得到收藏总数
 * @param {*} id 
 * @returns 
 */
export const getGarbageCount = (id) => {
    return httpInstance({
        method: 'GET',
        url: `/collection-to-garbage/garbageCount`,
        params:{
            id
        }
    })
}