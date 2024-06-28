import { httpRequest } from '@/utils/umiRequest';

/**
 * @description: 获取卡券列表
 */
export const fetchCoupons = () => httpRequest.get('/coupons');

/**
 * @description: 新建卡券
 */
export const createCoupons = (data: any) => httpRequest.post<string[]>('/coupons', data);

/**
 * 删除卡券
 * @param id
 * @returns
 */
export const deleteCoupons = (id: string) => httpRequest.delete('/coupons', { id });

/**
 * @description: 编辑卡券
 */
export const updateCoupons = (options: any) => httpRequest.patch('/coupons', options);

/**
 * @description: 获取会员卡券
 */
export const fetchCouponsMembersCoupons = (id?: string) =>
  httpRequest.get<string[]>('/members-coupons', { id });

/**
 * @description: 新建会员卡券
 */
export const createMembersCoupons = (data: any) =>
  httpRequest.post<string[]>('/members-coupons', data);

/**
 * @description: 核销会员卡券
 */
export const writeOffMemberCoupons = (data: any) =>
  httpRequest.patch<string[]>('/members-coupons', data);

/**
 * 删除会员卡券
 * @param id
 * @returns
 */
export const deleteMemberCoupon = (id: string) => httpRequest.delete(`/members-coupons/${id}`);

/**
 * @description: 获取会员卡券日志
 */
export const fetchCouponsMembersLogs = () => httpRequest.get<string[]>('/members-coupons/logs');