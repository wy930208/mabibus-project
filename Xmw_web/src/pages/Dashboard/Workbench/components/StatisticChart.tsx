import { StatisticCard } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import type { FC } from 'react';

import TinyAreaChart from './TinyAreaChart' // 迷你面积图
import TinyColumnChart from './TinyColumnChart' // 迷你柱形图

const StatisticChart: FC<{
  orderNumber: number,
  salesVolume: number,
  todayOrderNumber: number,
  todaySalesVolume: number,
  chartData: Record<string, {
    orderNumber: number,
    salesVolume: number,
  }>
} | undefined> = (props) => {


  return (
    <Row gutter={20}>
      <Col span={6}>
        <StatisticCard
          title="总销售额"
          tip="指标说明"
          style={{ height: 200 }}
          statistic={{
            value: props?.salesVolume,
            prefix: '¥',
            precision: 2,
          }}
          chart={<TinyAreaChart data={Object.keys(props?.chartData || {}).map((key) => {
            return props?.chartData[key].salesVolume ?? 0
          })} />}
        >
        </StatisticCard>
      </Col>
      <Col span={6}>
        <StatisticCard
          title="今日销售额"
          tip="指标说明"
          style={{ height: 200 }}
          statistic={{
            value: props?.todaySalesVolume,
            prefix: '¥',
            precision: 2,
          }}
        // chart={<TinyAreaChart />}
        >
        </StatisticCard>
      </Col>
      <Col span={6}>
        <StatisticCard
          title="订单数量"
          tip="指标说明"
          style={{ height: 200 }}
          statistic={{ value: props?.orderNumber }}
          chart={<TinyColumnChart data={Object.keys(props?.chartData || {}).map((key) => {
            return props?.chartData[key].orderNumber ?? 0
          })} />}
        >
        </StatisticCard>
      </Col>
      <Col span={6}>
        <StatisticCard
          title="今日订单数量"
          tip="指标说明"
          style={{ height: 200 }}
          statistic={{ value: props?.todayOrderNumber }}
        >
        </StatisticCard>
      </Col>
    </Row>
  )
}
export default StatisticChart
