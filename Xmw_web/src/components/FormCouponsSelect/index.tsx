import {
  ProColumns,
  ProFormSelect,
  ProFormSelectProps,
  ProTable,
} from '@ant-design/pro-components';
import { Divider } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import { fetchCoupons } from '@/services/coupons';

/**
 * 员工选择器
 * @param props 
 * @returns 
 */
const FormCouponsSelect: FC<ProFormSelectProps & {
  setFieldVale?: (value: string) => void
}> = (props) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selectValue, setSelectValue] = useState<any[]>([])

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '项目',
        dataIndex: 'coupon_name',
        ellipsis: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        ellipsis: true,
      },
    ]
  }, []);

  const fetchData = async () => {
    const list = await fetchCoupons().then((resp) => {
      return resp?.data;
    });

    setDataSource(list);

    return list?.map((u) => ({
      label: u.coupon_name,
      value: u.id,
    }));
  }

  const tableData = useMemo(() => {
    return dataSource?.filter((row) => row.id === selectValue || selectValue?.includes(row.id))
  }, [dataSource, selectValue]);

  return <div>
    <ProFormSelect
      {...props}
      request={fetchData}
      onChange={(value, all) => {
        setSelectValue(value);
        props?.onChange?.(value, all)
      }}
    >
    </ProFormSelect>
    <ProTable
      style={{ marginBottom: 24 }}
      rowKey="id"
      options={false}
      ghost
      columns={columns}
      dataSource={tableData}
      search={false}
      pagination={false}
    />
  </div>



}

export default FormCouponsSelect;
