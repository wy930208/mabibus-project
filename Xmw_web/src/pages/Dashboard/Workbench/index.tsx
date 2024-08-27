import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Space } from 'antd'
import dayjs from 'dayjs'
import { FC } from 'react';

import { getSalesDetail } from '@/services/sales';

import RenderContent from './components/RenderContent' // 顶部布局
import StatisticChart from './components/StatisticChart' // 指标卡片

const Workbench: FC = () => {
  const { data } = useRequest(getSalesDetail, {
    formatResult: ((resp) => {
      const saleIndex = resp.data;

      const todayIndex = saleIndex.filter((item) => {
        const targetDate = dayjs(item.created_time);
        return targetDate.isSame(dayjs(), 'day');
      })

     
      return {
        // 订单数量
        orderNumber: saleIndex.length,
        salesVolume: saleIndex.reduce((sum: number, item) => {
          // eslint-disable-next-line no-param-reassign
          sum += item.sale_amount
          return sum;
        }, 0),
        todayOrderNumber: todayIndex.length,
        todaySalesVolume: todayIndex.reduce((sum: number, item) => {
          // eslint-disable-next-line no-param-reassign
          sum += item.sale_amount
          return sum;
        }, 0),
      }
    }),
  });
  console.log('====sales=====', data);
  return (
    <PageContainer content={<RenderContent />}>
      <Space direction="vertical" size="middle" style={{ display: 'flex', marginTop: 16 }}>
        {/* 指标卡片 */}
        <div style={{ marginTop: '-12px' }} >
          <StatisticChart {...data} />
        </div>
      </Space>
    </PageContainer>
  )
}
export default Workbench