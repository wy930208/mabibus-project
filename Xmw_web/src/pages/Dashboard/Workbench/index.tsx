import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Space } from 'antd'
import { FC } from 'react';

import ServiceRegistration from '../ServiceRegistration';
import StoreIncome from '../StoreIncome';
import RenderContent from './components/RenderContent' // 顶部布局

const Workbench: FC = () => {
  // const { data } = useRequest(getSalesDetail, {
  //   formatResult: ((resp) => {
  //     const saleIndex = resp.data;

  //     const { todayIndex, chartData } = saleIndex.reduce((acc: any, item: any) => {
  //       const targetDate = dayjs(item.created_time);
  //       const date = item.created_time.slice(0, 10);

  //       const dayItem = acc.chartData[date];

  //       if (dayItem) {
  //         dayItem.orderNumber += 1;
  //         dayItem.salesVolume += item.sale_amount;
  //       } else {
  //         acc.chartData[date] = {
  //           orderNumber: 1,
  //           salesVolume: item.sale_amount,
  //         };
  //       }
  //       if (targetDate.isSame(dayjs(), 'day')) {
  //         acc.todayIndex.push(item);
  //       }
  //       return acc;
  //     }, {
  //       todayIndex: [],
  //       chartData: {},
  //     });

  //     return {
  //       // 订单数量
  //       orderNumber: saleIndex.length,
  //       salesVolume: saleIndex.reduce((sum: number, item) => {
  //         // eslint-disable-next-line no-param-reassign
  //         sum += item.sale_amount
  //         return sum;
  //       }, 0),
  //       todayOrderNumber: todayIndex.length,
  //       todaySalesVolume: todayIndex.reduce((sum: number, item) => {
  //         // eslint-disable-next-line no-param-reassign
  //         sum += item.sale_amount
  //         return sum;
  //       }, 0),
  //       SalesVolumeChartData: saleIndex.map((item) => item.sale_amount),
  //       chartData,
  //     }
  //   }),
  // });

  return (
    <PageContainer content={<RenderContent />}>
      <Space direction="vertical" size="middle" style={{ display: 'flex', marginTop: 16 }}>
        <ProCard
          tabs={{
            type: 'card',
          }}
        >
          <ProCard.TabPane key="tab1" tab="销售统计">
            <StoreIncome />
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="手工统计">
            <ServiceRegistration />
          </ProCard.TabPane>
        </ProCard>
       
      </Space>


    </PageContainer>
  )
}
export default Workbench