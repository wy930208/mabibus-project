import { PageContainer } from '@ant-design/pro-components';
import { Space } from 'antd'
import { FC } from 'react';

import RenderContent from './components/RenderContent' // 顶部布局
import StatisticChart from './components/StatisticChart' // 指标卡片

const Workbench: FC = () => {
  return (
    <PageContainer content={<RenderContent />}>
      <Space direction="vertical" size="middle" style={{ display: 'flex', marginTop: 16 }}>
        {/* 指标卡片 */}
        <div style={{ marginTop: '-12px' }} >
          <StatisticChart />
        </div>
      </Space>
    </PageContainer>
  )
}
export default Workbench