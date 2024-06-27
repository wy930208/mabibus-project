import { FC, useMemo } from "react";
import { ModalForm, ProFormDigit, ProFormSelect, ProFormText, ModalFormProps } from "@ant-design/pro-components";
import { Form } from 'antd';
import { CouponsTypeNameMap } from "../constants";
import { getCustomerList } from "@/services/customer";
import { useRequest } from "@umijs/max";
import { formatResponse } from "@/utils";

type Props = ModalFormProps

const selectOpt = Object.keys(CouponsTypeNameMap).map(key => ({
  value: key,
  label: CouponsTypeNameMap[key]
}))

const DistributeCouponsModal: FC<Props> = (props) => {
  const { ...otherProps } = props;
  const [form] = Form.useForm<{
    [x: string]: any; name: string; company: string
  }>();

  const { data = [], loading } = useRequest(() => getCustomerList({ deal: 1 }));

  const customerOpt = useMemo(() => {
    return data?.map((item: { id: string; user_name: string; }) => ({
      value: item.id,
      label: item.user_name
    }))
  }, [data]);

  return <ModalForm loading={loading} form={form} {...otherProps}>
    <ProFormText
      name="coupon_name"
      label="卡券名称"
      disabled
      rules={[{ required: true, message: '卡券名称不能为空' }]}
      placeholder="请输入卡券名称"
    />
    <ProFormSelect
      name="customers"
      mode='multiple'
      label="发放对象"
      options={customerOpt}
      // required
    />
    <ProFormDigit
      label="发放数量"
      rules={[{ required: true, message: '请输入发放数量' }]}
      name="quantity"
    />
  </ModalForm>
}

export default DistributeCouponsModal;