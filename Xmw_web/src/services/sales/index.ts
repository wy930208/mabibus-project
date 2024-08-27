import { httpRequest } from '@/utils/umiRequest';


export const createSaleOrder = (dto: any) => httpRequest.post('/sales', dto);

export const getSalesDetail = (customerId: string) => httpRequest.get(`/sales?customerId=${customerId}`);
 