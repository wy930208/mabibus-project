import {
  ActionType,
  ProTable,
} from '@ant-design/pro-components'
import { useRequest } from 'ahooks';
import { keyBy } from 'lodash-es'
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { columnScrollX } from '@/components/TableColumns';
import { getCouponsUse } from '@/services/coupons';
import { getUserList } from '@/services/system/user-management';


const getPaymentMethodName = (code: string) => {
  const methods = [{
    label: '现金',
    value: 'cash',
  },
  {
    label: '电子支付',
    value: 'ePayment',
  },
  {
    label: '账户余额',
    value: 'balance',
  }];

  return methods.find((item) => item.value === code)?.['label']
}

const ServiceRegistration: FC = () => {
  const tableRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<any[]>([]);

  const { data: userData } = useRequest(() => {
    return getUserList({
      current: 1,
      pageSize: 500,
    }).then((resp) => {
      return resp?.data?.list;
    })
  });

  const userDataMap = useMemo(() => {
    return keyBy(userData, 'user_id');
  }, [userData]);

  useEffect(() => {
    getCouponsUse().then((resp) => {
      const data: any[] = resp.data;
     
      const arr: any[] = [];
      data.forEach((item) => {
        item.service_items.forEach((o) => {
          arr.push({
            ...o,
            customer_id: item.customer_id,
            store_id: item.store_id,
            payment_method: item.payment_method,
            customer_name: item.customer_name,
            org_name: item.org_name,
          })
        })
      });
      setDataSource(arr)
    })
  }, []);

  const columns: any[] = useMemo(() => {
    return [
      {
        title: '员工姓名',
        dataIndex: 'teacher',
        width: 140,
        align: 'center',
        fixed: true,
        render: (val: string) => {
          return userDataMap[val]?.cn_name
        },
      },
      {
        title: '店面',
        dataIndex: 'org_name',
        ellipsis: true,
        width: 140,
        align: 'center',
      },
      {
        title: '客户姓名',
        dataIndex: 'customer_name',
        ellipsis: true,
        width: 140,
        align: 'center',
      },
      {
        title: '交易时间',
        dataIndex: 'created_time',
        ellipsis: true,
        width: 140,
        align: 'center',
      },
      {
        title: '付款方式',
        dataIndex: 'payment_method',
        ellipsis: true,
        width: 140,
        align: 'center',
        render: (value: string, record: any) => {
          return getPaymentMethodName(record.payment_method);
        },
      },
      {
        title: '金额',
        dataIndex: 'sale_price',
        ellipsis: true,
        width: 140,
        align: 'center',
        render: (value, record) => {
          return Number(record.sale_price) * record.count
        },
      },
      {
        title: '业绩',
        dataIndex: 'count',
        ellipsis: true,
        width: 160,
        align: 'center',
      },
      {
        title: '明细',
        dataIndex: 'coupon_name',
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
  }, [userDataMap]);

  return <ProTable
    bordered
    search={false}
    rowKey="id"
    actionRef={tableRef}
    dataSource={dataSource}
    columns={columns}
    scroll={{ x: columnScrollX(columns) }}
  />
}

export default ServiceRegistration;
