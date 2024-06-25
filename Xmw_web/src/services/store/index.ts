import { httpRequest } from '@/utils/umiRequest';

/**
 * @description: 获取当前用户信息
 */
export const getStoreList = () => httpRequest.get('/store');

/**
 * @description: 获取当前用户按钮权限
 */
export const createStore = (data: any) => httpRequest.post<string[]>('/store', data);

export const deleteStore = (id: string) => httpRequest.delete(`/store/${id}`);

export const updateStore = ({ id, ...options }: any) => httpRequest.patch(`/store/${id}`, options);

// /**
//  * @description: 获取用户权限菜单
//  * @Author: 白雾茫茫丶
//  */
// export const getRoutesMenus = () => httpRequest.get<API.MENUMANAGEMENT[]>('/auth/routes-menu');

// /**
//  * @description: 获取图形验证码
//  * @Author: 白雾茫茫丶
//  */
// export const getCaptcha = () => httpRequest.get<string>('/auth/verify-code');
