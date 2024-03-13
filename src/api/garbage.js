import httpInstance from "@/utils/http";

/**
 * 获取废品信息——分页
 * @param {*} page 
 * @param {*} pageSize 
 * @returns 
 */
export const getGarbage = (page='', pageSize='') => {
    return httpInstance({
        method: 'GET',
        url: '/garbage',
        params: {
            page,
            pageSize
        }
    })
}

/**
 * 添加废品
 * @param {*} data 
 * @returns 
 */
export const addGarbage = (data) => {
    console.log(data);
    return httpInstance({
        method: 'POST',
        url: '/garbage',
        data
    })
}

/**
 * 更新
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updateGarbage = (id, data) => {
    return httpInstance({
        method: 'PATCH',
        url: `/garbage/${id}`,
        data
    })
}

/**
 * 删除单个
 * @param {*} id 
 * @returns 
 */
export const deleteGarbage = (id) => {
    return httpInstance({
        method: 'DELETE',
        url: `/garbage/${id}`
    })
}

/**
 * 批量删除
 * @param {*} ids 
 * @returns 
 */
export const deleteGarbages = (ids) => {
    return httpInstance({
        method: 'DELETE',
        url: '/garbage',
        data: { ids }
    })
}

/**
 * 根据id获取单个对象（数据回显）
 * @param {*} id 
 * @returns 
 */
export const getGarbageOne = (id) => {
    return httpInstance({
        method: 'GET',
        url: `/garbage/${id}`
    })
}

/**
 * 根据指定id获取指定废品销量
 * @returns 
 */
export const findOneGarbageQuantity = (id) => {
    return httpInstance({
        method: 'POST',
        url: `/garbage/findOneGarbageQuantity/${id}`
    })
}

/**
 * 获取所有废品销量
 * @returns 
 */
export const findAllGarbageQuantity = () => {
    return httpInstance({
        method: 'POST',
        url: `/garbage/findAllGarbageQuantity`
    })
}

/**
 * 通过指定的id数组，判断其是否存在订单
 * @param {*} ids 
 * @returns 
 */
export const findorderToGarbage = (ids)=>{
    return httpInstance({
        method: 'POST',
        url: `/garbage/findorderToGarbage`,
        data: {ids}   
    })
}

/**
 * 获取根据具体分类分组
 * @returns 
 */
export const groupByGarbage = () => {
    return httpInstance({
        method: 'POST',
        url: `/garbage/groupByGarbage`
    })
}