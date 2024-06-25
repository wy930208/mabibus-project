import { httpRequest } from '@/utils/umiRequest';

interface GetCustomerListDto {
  phone?: number;
  store_id?: string;
  deal: number;
  user_name?: string;
}

/**
 * 获取客户列表
 * @returns 
 */
export const getCustomerList = (query: GetCustomerListDto) => httpRequest.get('/customer/info', query);

export const getCustomerById = (id: string) => httpRequest.get(`/customer/info/${id}`);

export const createCustomer = (data: any) => httpRequest.post<string[]>('/customer/info', data);

export const bulkCreateCustomer = (data: any) =>
  httpRequest.post<string[]>('/customer/info/bulk-create', data);

export const deleteCustomer = (id: string) => httpRequest.delete(`/customer/info/${id}`);

export const updateCustomer = ({ id, ...options }: any) =>
  httpRequest.patch(`/customer/info/${id}`, options);

/**
 * 获取用户评论
 * @param id
 * @returns
 */
export const getCustomerComment = (id: string) =>
  httpRequest.get(`/customer/comment?customer_id=${id}`);

/**
 * 新增用户评论
 * @param id
 * @returns
 */
export const createCustomerComment = (payload: {
  customer_id: string;
  content: string;
  from_uid: string;
}) => httpRequest.post(`/customer/comment`, payload);
