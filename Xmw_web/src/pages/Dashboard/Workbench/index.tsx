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

      const { todayIndex, chartData } = saleIndex.reduce((acc: any, item: any) => {
        const targetDate = dayjs(item.created_time);
        const date = item.created_time.slice(0, 10);

        const dayItem = acc.chartData[date];

        if (dayItem) {
          dayItem.orderNumber += 1;
          dayItem.salesVolume += item.sale_amount;
        } else {
          acc.chartData[date] = {
            orderNumber: 1,
            salesVolume: item.sale_amount,
          };
        }
        if (targetDate.isSame(dayjs(), 'day')) {
          acc.todayIndex.push(item);
        }
        return acc;
      }, {
        todayIndex: [],
        chartData: {},
      });

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
        SalesVolumeChartData: saleIndex.map((item) => item.sale_amount),
        chartData,
      }
    }),
  });
 
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