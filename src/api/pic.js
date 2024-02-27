import httpInstance from '@/utils/http';

/**
 * 上传文件
 * @param {*} file 
 * @returns 
 */
export const upload = (file) => {
    return httpInstance({
        method: 'POST',
        url: '/pic/upload',
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

