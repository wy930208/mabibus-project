import {
  ProFormSelect,
  ProFormSelectProps,
} from '@ant-design/pro-components';
import React, { FC } from 'react';

import { getUserList } from '@/services/system/user-management';

/**
 * 员工选择器
 * @param props 
 * @returns 
 */
const FormStaffSelect: FC<ProFormSelectProps & {
  setFieldVale?: (value: string) => void
}> = (props) => {

  const fetchData = async () => {
    const list = await getUserList({
      current: 1,
      pageSize: 500,
    }).then((resp) => {
      return resp?.data?.list;
    });

    return list?.map((u) => ({
      label: u.cn_name,
      value: u.user_id,
    }))
  }

  return <ProFormSelect
    {...props}
    request={fetchData}
  >
  </ProFormSelect>

}

export default FormStaffSelect;
