import httpInstance from '@/utils/http';

/**
 * 邮箱登录方法 
 * @param {*} userEmail 
 * @param {*} userPass 
 * @returns 
 */
export const emailLogin = (userEmail, userPass) => {
    return httpInstance({
        method: 'POST',
        url: '/user/login',
        data: {
            userEmail,
            userPass
        }
    })
}

/**
 * 注册方法
 * @param {*} data 
 * @returns 
 */
export const register = (userEmail, userPass, userName, userPhone, userAddress) => {
    return httpInstance({
        method: 'POST',
        url: '/user',
        data: {
            userEmail, userPass, userName, userPhone, userAddress
        }
    })
}

/**
 * 获取验证码
 * @param {*} userEmail 
 * @returns 
 */
export const getCode = (userEmail) => {
    return httpInstance({
        method: 'POST',
        url: '/user/email',
        data: {
            userEmail
        }
    })
}

/**
 * 验证码登录
 * @param {*} userEmail 
 * @param {*} codeVerification 
 * @returns 
 */
export const codeVerificationLogin = (userEmail, codeVerification) => {
    return httpInstance({
        method: 'POST',
        url: '/user/codeLogin',
        data: {
            userEmail, codeVerification
        }
    })
}

/**
 * 用户分页请求
 * @param {*} page 
 * @param {*} pageSize 
 * @returns 
 */
export const findAllUser = (page = '', pageSize = '',userId) => {
    return httpInstance({
        method: 'GET',
        url: '/user/',
        params: {
            page,
            pageSize,
            userId
        }
    })
}

/**
 * 更新、修改用户数据
 * @param {*} userId 
 * @param {*} user 
 * @returns 
 */
export const updateUser = (userId, user) => {
    return httpInstance({
        method: 'Patch',
        url: `/user/${userId}`,
        data: {user}
    })
}

/**
 * 删除一系列用户
 * @param {*} ids 
 * @returns 
 */
export const deleteUsers = (ids) => {
    return httpInstance({
        method: 'DELETE',
        url: '/user/',
        data: {
            ids
        }
    })
}

/**
 * 删除指定用户
 * @param {*} userId 
 * @returns 
 */
export const deleteUser = (userId) => {
    return httpInstance({
        method: 'DELETE',
        url: `/user/${userId}`
    })
}

/**
 * 修改指定类型的数据
 * @param {*} updateUser 
 * @param {*} type 
 * @returns 
 */
export const updateUserOne = (updateData) => {
    return httpInstance({
        method: 'POST',
        url: '/user/updateOne',
        data: {
            updateData
        }
    })
}

/**
 * 获取用户分级及其总数
 */
export const groupUser = () => {
    return httpInstance({
        method: 'POST',
        url: '/user/groupUser'
    })
}
