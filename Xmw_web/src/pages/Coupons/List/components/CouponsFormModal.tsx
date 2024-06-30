import { ModalForm, ModalFormProps, ProFormDateRangePicker, ProFormDigit, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Form } from 'antd';
import { FC, useState } from 'react';

import { CouponsTypeNameMap } from '../constants';

type Props = ModalFormProps & {
  storeList: { value: string; label: string }[]
}

const selectOpt = Object.keys(CouponsTypeNameMap).map((key) => ({
  value: key,
  label: CouponsTypeNameMap[key],
}))

const CouponsFormModal: FC<Props> = (props) => {
  const { ...otherProps } = props;
  const [form] = Form.useForm<{
    [x: string]: any; name: string; company: string
  }>();

  const [formValue, setFromValue] = useState(otherProps.initialValues);

  return <ModalForm form={form} {...otherProps} onValuesChange={(value, values) => {
    setFromValue(values)
  }}>
    <ProFormText
      name="coupon_name"
      label="卡券名称"
      rules={[{ required: true, message: '卡券名称不能为空' }]}
      placeholder="请输入卡券名称"
    />
    <ProFormSelect
      name="coupon_type"
      label="卡券类型"
      rules={[{ required: true, message: '请选择类型' }]}
      options={selectOpt}
    />
    {formValue?.coupon_type === 'prepaid' && <ProFormDigit
      label="卡券面额"
      required
      rules={[{ required: true, message: '金额不能为空' }]}
      name="amount"
    />}
    {formValue?.coupon_type === 'times' && <ProFormDigit
      label="使用次数"
      name="times"
    />}
    <ProFormRadio.Group
      label="过期类型"
      name="expire_type"
      options={[
        {
          value: 'fix',
          label: '固定时间',
        }, {
          value: 'flex',
          label: '领取后生效',
        },
      ]}
    />
    {formValue?.expire_type === 'fix' && <ProFormDateRangePicker
      label="有效日期"
      name="expireTimeRange"
    />}
    {formValue?.expire_type === 'flex' && <ProFormDigit
      label="有效天数"
      name="expireDay"
    />}
    {/* <ProFormSelect
      name="applicable_stores"
      label="适用店铺"
      mode="multiple"
      options={storeList}
    /> */}
    <ProFormText
      name="remark"
      label="备注"
    />
    <ProFormRadio.Group
      label="状态"
      name="status"
      options={[{
        value: 0,
        label: '禁用',
      },
      {
        value: 1,
        label: '启用',
      }]}
    />
  </ModalForm>
}

export default CouponsFormModal;