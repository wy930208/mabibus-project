import {
  ProColumns,
  ProFormSelect,
  ProFormSelectProps,
  ProTable,
} from '@ant-design/pro-components';
import { Typography } from 'antd';
import React, { FC,useMemo, useState } from 'react';

import { fetchCoupons } from '@/services/coupons';

/**
 * 员工选择器
 * @param props 
 * @returns 
 */
const FormCouponsSelect: FC<ProFormSelectProps & {
  value?: string[];
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
        title: '价格',
        dataIndex: 'sale_price',
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
    const val = props.value || selectValue;
    return dataSource?.filter((row) => row.id === val || val?.includes(row.id))
  }, [dataSource, props.value, selectValue]);

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
      summary={(pageData) => {
        let total = 0;
        pageData.forEach(({ sale_price }) => {
          total += sale_price;
        });
        return <ProTable.Summary fixed>
          <ProTable.Summary.Row>
            <ProTable.Summary.Cell index={0}><strong>金额合计</strong></ProTable.Summary.Cell>
            <ProTable.Summary.Cell index={1}>
              <Typography.Text type="danger">{total}</Typography.Text>
            </ProTable.Summary.Cell>
          </ProTable.Summary.Row>
        </ProTable.Summary>

      }}
      search={false}
      pagination={false}
    />
  </div>



}

export default FormCouponsSelect;
