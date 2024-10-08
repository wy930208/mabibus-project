import {
  ProFormSelect,
  ProFormSelectProps,
} from '@ant-design/pro-components';
import { useRequest, useUpdate } from 'ahooks';
import { Button, Descriptions, DescriptionsProps, Form, Space } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import { getCustomerList } from '@/services/customer';

import CreateCustomerModal from './components/CreateCustomerModal';

const SHOW_CUSTOMER_INFO: Record<string, React.Key> = {
  user_name: '用户名称',
  phone: '联系电话',
  amount: '余额',
}

const FormCustomerSelect: FC<ProFormSelectProps & {
  setFieldVale?: (value: string) => void
}> = (props) => {
  const [visible, setVisible] = useState(false);

  const form = Form.useFormInstance();


  const { data, runAsync } = useRequest(async () => {
    return getCustomerList().then((r) => r.data)
  });

  const [selectId, setSelectId] = useState<string | undefined>();

  const selectCustomer = useMemo(() => {
    const found = data?.find((item) => item.id === selectId);

    if (!found) return [];

    return Object.keys(found).filter((key) => !!SHOW_CUSTOMER_INFO[key]).map((key) => {
      return {
        key: key,
        label: SHOW_CUSTOMER_INFO[key],
        children: found[key],
      }
    }) as DescriptionsProps['items'];

  }, [data, selectId])

  const opts = useMemo(() => {
    return data?.map((item) => {
      return {
        label: item.user_name,
        value: item.id,
      }
    })
  }, [data]);

  return <>
    <ProFormSelect
      {...props}
      style={{ width: 300 }}
      options={opts}
      onChange={(value, allValue) => {
        setSelectId(value);
        form.setFieldsValue({
          [props.name]: value,
        })
        props?.onChange?.(value, allValue);
      }}
      showSearch
      addonAfter={<Space>
        <Button type="primary" onClick={() => setVisible(true)}>新建会员</Button>
        <Button type="primary" onClick={() => setVisible(true)}>新建潜在客户</Button>
      </Space>}
    />

    {!!selectCustomer?.length ? <div>
      <p style={{ marginLeft: 12 }}>信息核对:</p>
      <Descriptions style={{ marginBottom: 24 }} column={3} size="small" bordered items={selectCustomer} />
    </div> : null}

    <CreateCustomerModal
      open={visible}
      onFinish={async (data) => {
        setVisible(false);
        await runAsync();
        form.setFieldsValue({
          customer: data.id,
        });
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => setVisible(false),
      }}
    />
  </>
}

export default FormCustomerSelect;
