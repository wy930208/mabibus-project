import { httpRequest } from '@/utils/umiRequest';

/**
 * @description: 获取当前用户信息
 */
export const fetchCoupons = () => httpRequest.get('/coupons');

/**
 * @description: 获取当前用户按钮权限
 */
export const createStore = (data: any) => httpRequest.post<string[]>('/store', data);

/**
 * 
 * @param id 
 * @returns 
 */
export const deleteStore = (id: string) => httpRequest.delete(`/store/${id}`);

export const updateStore = ({ id, ...options }: any) => httpRequest.patch(`/store/${id}`, options);
