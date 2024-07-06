import {
  ProFormSelect,
  ProFormSelectProps,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import React, { FC, useMemo } from 'react';

import { getOrganizationList } from '@/services/administrative/organization';

const FormStoreSelect: FC<ProFormSelectProps & {
  setFieldVale?: (value: string) => void
}> = (props) => {


  const { data } = useRequest(async () => {
    return getOrganizationList().then((r) => r.data);
  });

  const opts = useMemo(() => {
    const list: {
      value: string;
      label: string
    }[] = [];
    data?.[0]?.children?.forEach((item) => {
      if (item.org_type === 'unit') {
        list.push({
          value: item.org_id,
          label: item.org_name,
        })
      }

      if (item.children) {
        item.children?.forEach((item) => {
          if (item.org_type === 'unit') {
            list.push({
              value: item.org_id,
              label: item.org_name,
            })
          }
        });
      }
    })
    return list;
  }, [data]);

  return <ProFormSelect
    {...props}
    options={opts}
  >
  </ProFormSelect>

}

export default FormStoreSelect;
