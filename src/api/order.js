import httpInstance from '@/utils/http';

/**
 * 获取订单总数
 * @returns 
 */
export const getOrderTotal = () => {
    return httpInstance({
        method: 'GET',
        url:'/order/count'
    })
}