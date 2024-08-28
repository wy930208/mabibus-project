import { useRequest } from 'ahooks';
import { Table } from 'antd'
import { FC } from 'react';

import { fetchCouponsMembersCoupons } from '@/services/coupons';

const CustomerCouponsList: FC<{ customerId: string }> = ({
  customerId,
}) => {
  const { data } = useRequest(() => {
    return fetchCouponsMembersCoupons(undefined, customerId).then((resp) => resp.data)
  }, {
    refreshDeps: [customerId],
  });

  // const formattedData = useMemo(() => {
  //   const couponMap = groupBy(data, 'coupons_id');
  //   return Object.keys(groupBy(data, 'coupons_id')).map((key) => {
  //     const item = couponMap[key]
  //     return {
  //       count: item.length,
  //       coupon_name: item[0].coupon_name,
  //       coupon_type: item[0].coupon_type,
  //       ...item.reduce((acc, o) => {
  //         acc.remaining_times += o.remaining_times;
  //         acc.balance += o.balance;
  //         return acc;
  //       }, {
  //         remaining_times: 0,
  //         balance: 0,
  //       }),

  //       list: item,
  //     }
  //   });
  // }, [data]);

// console.log('=====data1====', formattedData);

return <Table
  pagination={false}
  style={{
    height: 400,
    overflow: 'scroll',
  }}
  columns={[
    {
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '产品名称',
      dataIndex: 'coupon_name',
    },
    // {
    //   title: '数量',
    //   dataIndex: 'count',
    // },
    {
      title: '余额/次数',
      dataIndex: 'coupon_name',
      render: (_, record) => {
        return record.coupon_type === 'times'
          ? `剩 ${record.remaining_times} 次`
          : `剩 ¥${record.balance} 元`
      },
    },
  ]} dataSource={data} />
}

export default CustomerCouponsList;