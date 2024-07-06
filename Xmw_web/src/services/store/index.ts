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

/**
 * @description: 获取用户权限菜单
 * @Author: 白雾茫茫丶
 */
export const getRoutesMenus = () => httpRequest.get<API.MENUMANAGEMENT[]>('/auth/routes-menu');

export const getAppointmentList = (query: Record<string, any>) =>
  httpRequest.get('/appointment', query);

export const createAppointment = (data: any) => httpRequest.post<string[]>('/appointment', data);
