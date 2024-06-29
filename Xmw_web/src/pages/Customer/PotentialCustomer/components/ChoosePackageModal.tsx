import { ModalForm, ModalFormProps, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Form } from 'antd';
import { FC, useMemo } from 'react';

import { getOrganizationList } from '@/services/administrative/organization';
import { fetchCoupons } from '@/services/coupons';

type Props = ModalFormProps

const ChoosePackageModal: FC<Props> = (props) => {
  const [form] = Form.useForm<{
    [x: string]: any; name: string; company: string
  }>();

  const { data: coupons = [], loading } = useRequest(fetchCoupons);
  const { data: orgList = [] } = useRequest(getOrganizationList);

  const pakOpt = useMemo(() => {
    return coupons?.map((item: { id: string; coupon_name: string; }) => ({
      value: item.id,
      label: item.coupon_name,
    }))
  }, [coupons]);

  const orgOpt = useMemo(() => {
    return orgList[0]?.children?.map((item) => ({
      value: item.org_id,
      label: item.org_name,
    }))
  }, [orgList]);

  return <ModalForm loading={loading} form={form} {...props} width={360}>
    <ProFormText
      name="user_name"
      label="姓名"
      disabled
    />
    <ProFormSelect
      name="coupon_id"
      label="套餐"
      rules={[{ required: true, message: '请选择套餐' }]}
      options={pakOpt}
    />
    <ProFormSelect
      label="适用店铺"
      rules={[{ required: true, message: '请选择门店' }]}
      name="applicable_store_id"
      options={orgOpt}
    />
  </ModalForm>
}

export default ChoosePackageModal;