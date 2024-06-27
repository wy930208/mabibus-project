import { ModalForm, ModalFormProps,ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Form, Typography } from 'antd';
import { FC } from 'react';

type Props = ModalFormProps

const DistributeCouponsModal: FC<Props> = (props) => {
  const { initialValues = {} } = props;
  const [form] = Form.useForm<{
    [x: string]: any; name: string; company: string
  }>();


  return <ModalForm width={500} form={form} {...props}>
    <ProFormText
      name="coupon_name"
      label="卡券名称"
      disabled
    />
    <ProFormText
      name="user_name"
      label="会员名称"
      disabled
    />
    <ProFormText
      name="expire_time"
      label="过期时间"
      disabled
    />
    <ProFormText
      name="expire_time"
      label="过期时间"
      disabled
    />
    {initialValues?.coupon_type === 'prepaid' && <>
      <ProFormDigit
        name="amount"
        label="卡券面额"
        disabled
      />
      <ProFormDigit
        name="balance"
        label="卡券余额"
        disabled
      />
      <ProFormDigit
        name="write_off_amount"
        label="核销金额"
        max={initialValues?.balance}
        placeholder="请输入本次的核销金额"
      />
    </>}
    {initialValues?.coupon_type === 'times' &&
      <ProFormDigit
        name="write_off_times"
        initialValue={1}
        label={<span>
          核销次数(共<Typography.Text type="success">{initialValues?.times}</Typography.Text>次，剩余
          <Typography.Text type="danger">{initialValues?.remaining_times}</Typography.Text>次未核销)
        </span>}
        min={1}
        max={initialValues?.remaining_times}
        placeholder="请输入本次的核销次数"
      />
    }
    <ProFormTextArea
      name="write_off_remark"
      label="核销备注"
    />
  </ModalForm>
}

export default DistributeCouponsModal;