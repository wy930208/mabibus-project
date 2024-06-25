import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components'
import { Link, useRequest } from '@umijs/max';
import { Button, Space } from 'antd';
import { FC, useMemo, useRef, useState } from 'react';

import DropdownMenu from '@/components/DropdownMenu';
import { columnScrollX, CreateButton, operationColumn } from '@/components/TableColumns';
import { deleteCustomer } from '@/services/customer';
import { getStoreList } from '@/services/store';
import { ROUTES } from '@/utils/enums';
import { fetchCoupons } from '@/services/coupons';
import CouponsFormModal from './components/CouponsFormModal';
import { CouponsTypeNameMap } from './constants';
import DistributeCouponsModal from './components/DistributeCouponsModal';

const CouponsList: FC = () => {
  const [visible, setVisible] = useState(false);
  const [couponsModalVisible, setCouponsModalVisible] = useState(false);


  const { data: storeList = [] } = useRequest(getStoreList, {
    formatResult(resp) {
      return resp.data.map((o: { id: string; store_name: string; }) => ({ value: o.id, label: o.store_name }));
    }
  });

  const [initFromValue, setInitFromValue] = useState();

  const tableRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '卡券名称',
        dataIndex: 'coupon_name',
        ellipsis: true,
        width: 100,
        fixed: true,
        align: 'center',
      },
      {
        title: '类型',
        dataIndex: 'coupon_type',
        ellipsis: true,
        width: 100,
        fixed: true,
        align: 'center',
        render(_, record) {
          return CouponsTypeNameMap[record.coupon_type]
        }
      },
      {
        title: '有效期',
        dataIndex: 'expire',
        width: 100,
        fixed: true,
        align: 'center',
        render(_, record) {
          if (record.expire_type === 'fix') {
            return <Space direction="vertical"><span>{record.beginTime}</span><span>{record.endTime}</span></Space>;
          } else {
            return `领取${record.expireDay}后天过期`
          }
        }
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
            <Button size="small" onClick={() => {
              setCouponsModalVisible(true);
              setInitFromValue(record)
            }} key="detail">发券</Button>
            <DropdownMenu
              key="opt"
              pathName={ROUTES.STORE_MANAGEMENT}
              editCallback={() => {
                setInitFromValue({
                  ...record,
                  expireTimeRange: [record.beginTime, record.endTimes]
                });
                setVisible(true);
              }}
              deleteParams={{
                request: deleteCustomer,
                id: record.id,
              }}
              reloadTable={() => tableRef.current?.reload()}
            />
          </Space>
        },
      },
    ]
  }, [storeList]);

  const fetchTableData = async (params: any) => {
    return fetchCoupons()
  }

  return <PageContainer header={{ title: null }}>
    <ProTable
      actionRef={tableRef}
      request={fetchTableData}
      columns={columns}
      // 工具栏
      toolBarRender={() => [
        <CreateButton
          key="create"
          pathName={ROUTES.STORE_MANAGEMENT}
          callback={() => { setVisible(true) }} />,
      ]}
      scroll={{ x: columnScrollX(columns) }}
    />
    <CouponsFormModal
      title="卡券管理"
      width={500}
      open={visible}
      initialValues={initFromValue}
      modalProps={{
        onCancel: () => setVisible(false),
      }}
      onFinish={async (values) => {
        // const id = form.getFieldValue('id');
        // const msgPrix = id ? '更新' : '创建';
        // if (id) {
        //   await updateCustomer({ id, ...values });
        // } else {
        //   await createCustomer(values);
        // }
        // message.success(`${msgPrix}成功`);
        // setVisible(false);
        // tableRef.current?.reload();
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => setVisible(false),
      }}
      storeList={storeList}
    />
    <DistributeCouponsModal
      modalProps={{
        onCancel: () => setCouponsModalVisible(false),
      }}
      initialValues={initFromValue}
      onFinish={async () => {
        setCouponsModalVisible(false);
      }} open={couponsModalVisible} />
  </PageContainer>
}

export default CouponsList;
