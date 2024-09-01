import {
  ActionType,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components'
import { FC, useMemo, useRef } from 'react';

import { columnScrollX } from '@/components/TableColumns';
import { getSalesDetail } from '@/services/sales';

const StoreIncome: FC = () => {
  const tableRef = useRef<ActionType>();


  const columns: any[] = useMemo(() => {
    return [
      {
        title: '时间',
        dataIndex: 'created_time',
        width: 140,
        align: 'center',
        render: (val: string) => {
          return val?.slice(0, 10)
        },
      },
      {
        title: '姓名',
        dataIndex: 'user_name',
        ellipsis: true,
        width: 140,
        fixed: true,
        align: 'center',
        render: (_, record: any) => {
          return record.product_items[0].user_name
        },
      },
      {
        title: '项目',
        dataIndex: 'product_items',
        ellipsis: true,
        width: 160,
        align: 'center',
        render: (_, record: any) => {
          return record.product_items.map((o) => o.coupon_name).join('、')
        },
      },
      {
        title: '业绩',
        dataIndex: 'sale_amount',
        ellipsis: true,
        width: 160,
        align: 'center',
      },
      {
        title: '开卡人员',
        dataIndex: 'sale_name',
        ellipsis: true,
        width: 160,
        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        align: 'center',
      },
    ]
  }, []);

  return <PageContainer header={{ title: null }}>
    <ProTable
      bordered
      search={false}
      rowKey="id"
      actionRef={tableRef}
      request={async () => getSalesDetail()}
      columns={columns}
      scroll={{ x: columnScrollX(columns) }}
    />
  </PageContainer>
}

export default StoreIncome;
