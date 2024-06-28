import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components'
import { Button, message, Space, Tag } from 'antd';
import { FC, useMemo, useRef } from 'react';

import { columnScrollX, operationColumn } from '@/components/TableColumns';
import { deleteMemberCoupon, fetchCouponsMembersLogs } from '@/services/coupons';

import { CouponsTypeNameMap } from '../List/constants';

const CouponsLogs: FC = () => {


  const tableRef = useRef<ActionType>();

  const rollbackRecord = async (id: string) => {
    try {
      await deleteMemberCoupon(id);
      message.success('删除成功');
      tableRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  }

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '卡券名称',
        dataIndex: 'coupon_name',
        ellipsis: true,
        width: 160,
        fixed: true,
        align: 'center',
      },
      {
        title: '类型',
        dataIndex: 'coupon_type',
        width: 80,
        align: 'center',
        render(_, record) {
          return CouponsTypeNameMap[record.coupon_type]
        },
      },
      {
        title: '会员名称',
        dataIndex: 'customer_name',
        ellipsis: true,
        width: 140,
        align: 'center',
      },
      {
        title: '会员联系方式',
        dataIndex: 'phone',
        width: 120,
        align: 'center',
      },
      {
        title: '卡券面额',
        dataIndex: 'amount',
        width: 100,
        align: 'center',
      },
      {
        title: '核销金额',
        dataIndex: 'write_off_amount',
        width: 100,
        align: 'center',
      },
      {
        title: '余额',
        dataIndex: 'balance',
        width: 100,
        align: 'center',
      },
      {
        title: '卡券次数',
        dataIndex: 'times',
        width: 100,
        align: 'center',
      },
      {
        title: '核销次数',
        dataIndex: 'write_off_times',
        width: 100,
        align: 'center',
      },
      {
        title: '核销次数',
        dataIndex: 'remaining_times',
        width: 100,
        align: 'center',
      },
      {
        title: '操作人',
        dataIndex: 'operator_name',
        width: 140,
        align: 'center',
      },
      {
        title: '操作类型',
        dataIndex: 'status',
        width: 140,
        align: 'center',
        render(_, record) {
          return record.status === 0
            ? <Tag color='green'>核销</Tag>
            : <Tag color='red'>撤核</Tag>
        },
      },
      {
        title: '核销时间',
        dataIndex: 'created_time',
        width: 180,
        align: 'center',
      },
      {
        ...operationColumn,
        width: 140,
        align: 'center',
        render: (_, record) => {
          return <Space size={20}>
            <Button
              type="primary"
              danger
              size="small"
              onClick={() => {
                rollbackRecord(record);
              }}
              key="delete"
            >撤回</Button>
          </Space>
        },
      },
    ]
  }, []);

  return <PageContainer header={{ title: null }}>
    <ProTable
      rowKey="id"
      actionRef={tableRef}
      request={async () => fetchCouponsMembersLogs()}
      columns={columns}
      scroll={{ x: columnScrollX(columns) }}
    />
  </PageContainer>
}

export default CouponsLogs;
