import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components'
import { history, useRequest } from '@umijs/max';
import { Button, message, Space, Tag } from 'antd';
import { FC, useMemo, useRef, useState } from 'react';

import { columnScrollX, operationColumn } from '@/components/TableColumns';
import { deleteMemberCoupon, fetchCouponsMembersCoupons } from '@/services/coupons';

import { CouponsTypeNameMap } from '../List/constants';

const CouponsMembers: FC = () => {
  const [visible, setVisible] = useState(false);


  const tableRef = useRef<ActionType>();

  const deleteItem = async (id: string) => {
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
        title: '会员名称',
        dataIndex: 'user_name',
        ellipsis: true,
        width: 140,
        fixed: true,
        align: 'center',
      },
      {
        title: '卡券名称',
        dataIndex: 'coupon_name',
        ellipsis: true,
        width: 160,
        fixed: true,
        align: 'center',
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
        width: 120,
        align: 'center',
      },
      {
        title: '余额',
        dataIndex: 'balance',
        width: 100,
        align: 'center',
      },
      {
        title: '剩余未核销(次)',
        dataIndex: 'remaining_times',
        width: 120,
        align: 'center',
        render(_, record) {
          return record.coupon_type === 'times' ? record.remaining_times : '-'
        },
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
        title: '核销码',
        dataIndex: 'write_off_code',
        width: 180,
        align: 'center',
      },
      {
        title: '过期时间',
        dataIndex: 'expire_time',
        width: 140,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 140,
        align: 'center',
        render(_, record) {
          return record.status === 0
            ? <Tag color='green'>未核销</Tag>
            : record.status === 1
              ? <Tag color='red'>已核销</Tag>
              : <Tag color='blue'>部分核销</Tag>;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_time',
        width: 140,
        align: 'center',
      },
      {
        ...operationColumn,
        width: 140,
        align: 'center',
        render: (_, record) => {
          return <Space size={20}>
            <Button type="primary" size="small" onClick={() => {
              history.push('/coupons/write-off', record);
            }} key="detail">
              去核销
            </Button>
            <Button
              type="primary"
              danger
              size="small"
              onClick={() => {
                deleteItem(record.id);
              }}
              key="delete"
            >作废</Button>
          </Space>
        },
      },
    ]
  }, []);

  const onCreateCoupon = () => {
    // setCurrentRecord(undefined);
    setVisible(true);
  }

  return <PageContainer header={{ title: null }}>
    <ProTable
      rowKey="id"
      actionRef={tableRef}
      request={async () => fetchCouponsMembersCoupons()}
      columns={columns}
      toolBarRender={() => [
        <Button key="writeoff">卡券核销</Button>,
      ]}
      scroll={{ x: columnScrollX(columns) }}
    />
  </PageContainer>
}

export default CouponsMembers;
