import httpInstance from '@/utils/http';

/**
 * 上传文件
 * @param {*} file 
 * @returns 
 */
export const upload = (file) => {
    return httpInstance({
        method: 'POST',
        url: `/pic/upload`,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data:file 
    })
}

/**
 * 更新图片文件
 * @param {*} file 
 * @param {*} id 
 * @returns 
 */
export const updatePic = (file,id) => {
    return httpInstance({
        method: 'PATCH',
        url: `/pic/${id}`,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data:file 
    })
}

/**
 * 获取图片——分页
 * @param {*} page 
 * @param {*} pageSize 
 * @returns 
 */
export const getPicList = (page = '', pageSize = '') => {
    return httpInstance({
        method: 'GET',
        url: '/pic',
        params: {
            page,
            pageSize
        }
    })
}

/**
 * 删除一张图片
 * @param {*} id 
 * @returns 
 */
export const deletePic = (id)=>{
    return httpInstance({
        method: 'DELETE',
        url: `/pic/${id}`
    })
}

