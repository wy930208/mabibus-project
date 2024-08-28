import {
  ProColumns,
  ProFormSelect,
  ProFormSelectProps,
  ProTable,
} from '@ant-design/pro-components';
import { Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';

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
 

 
  return <div>
    <ProFormSelect
      {...props}
    >
    </ProFormSelect>
    {/* <ProTable
      style={{ marginBottom: 24, maxHeight: 240, overflow: 'scroll' }}
      rowKey="id"
      options={false}
      ghost
      columns={columns}
      dataSource={tableData}
      size='small'
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
    /> */}
  </div>



}

export default FormCouponsSelect;
