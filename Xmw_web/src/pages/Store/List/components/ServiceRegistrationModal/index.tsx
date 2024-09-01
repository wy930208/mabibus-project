import {
  ProCard,
  ProForm, ProFormDigit, ProFormSelect, ProFormText,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Form, InputNumber, message, Modal, ModalProps, Select, Table } from 'antd';
import { groupBy } from 'lodash-es'
import { FC, useMemo, useState } from 'react';

import CustomerCouponsList from '@/components/CustomerCouponsList';
import FormCustomerSelect from '@/components/FormCustomerSelect';
import { couponsUse, fetchCoupons, fetchCouponsMembersCoupons } from '@/services/coupons';
import { getUserList } from '@/services/system/user-management';

import style from './index.module.less'

const ServiceRegistrationModal: FC<ModalProps> = (props) => {
  const [form] = Form.useForm<{
    [x: string]: any;
    name: string;
    company: string;
  }>();
  const { initialState } = useModel('@@initialState');

  
  const onSubmit = async () => {
    
    const payload: Record<string, any> = {
      store_id: initialState.CurrentUser.org_id,
    };

    const useCouponsMap: Record<string, any> = {};

    const fieldsData = await form.validateFields();

    Object.keys(fieldsData).forEach((key) => {
      const value = fieldsData[key];

      if (key.includes('couponsCount_')) {
        const [, id] = key.split('_');
        if (useCouponsMap[id]) {
          useCouponsMap[id].count = value
        } else {
          useCouponsMap[id] = {
            count: value,
          }
        }
      } else if (key.includes('teacher_')) {
        const [, id] = key.split('_');
        if (useCouponsMap[id]) {
          useCouponsMap[id].teacher = value
        } else {
          useCouponsMap[id] = {
            teacher: value,
          }
        }
      } else {
        payload[key] = value;
      }
    });

    payload.useCoupons = Object.keys(useCouponsMap).map((key) => {
      return {
        ...useCouponsMap[key],
        id: key,
      }
    });

    const res = await couponsUse(payload);
    if (res.code !== 200) {
      message.error(res.msg);
      return Promise.reject(res.msg);
    }
    return message.success('信息提交成功!');
  };

  const [customerId, setCustomerId] = useState<string | undefined>();

  const { data } = useRequest(() => fetchCoupons().then((resp) => resp.data));

  const { data: memberCouponsData } = useRequest(() => {
    return fetchCouponsMembersCoupons(undefined, customerId).then((resp) => resp.data)
  }, {
    refreshDeps: [customerId],
  });

  const memberCouponsFormattedData = useMemo(() => {
    const couponMap = groupBy(memberCouponsData, 'coupons_id');

    return Object.keys(groupBy(memberCouponsData, 'coupons_id')).map((key) => {
      const item = couponMap[key]
      return {
        count: item.length,
        coupons_id: item[0].coupons_id,
        coupon_name: item[0].coupon_name,
        coupon_type: item[0].coupon_type,
        ...item.reduce((acc, o) => {
          acc.remaining_times += o.remaining_times;
          acc.balance += o.balance;
          return acc;
        }, {
          remaining_times: 0,
          balance: 0,
        }),

        list: item,
      }
    });
  }, [memberCouponsData]);


  const selectOpt = useMemo(() => {
    return data?.map((u) => ({
      label: u.coupon_name,
      value: u.id,
      source: u,
    }));
  }, [data]);

  const [selectValue, setSelectValue] = useState<any>([]);

  const tableData = useMemo(() => {
    return data?.filter((row: any) => selectValue?.includes(row.id))
  }, [data, selectValue])

  const { data: userData } = useRequest(() => {
    return getUserList({
      current: 1,
      pageSize: 500,
    }).then((resp) => {
      return resp?.data?.list;
    })
  });

  const userSelectOpt = useMemo(() => {
    return userData?.map((u) => ({
      label: u.cn_name,
      value: u.user_id,
    }));
  }, [userData]);

  return <Modal
    title="服务登记"
    onClose={() => {
      form.resetFields()
    }}
    {...props}
    onOk={async () => {
      await onSubmit();
      props?.onCancel?.(undefined as any);
    }}>
    <ProCard gutter={8} ghost>
      <ProCard bordered colSpan={16} title={<></>}>
        <ProForm
          form={form}
          grid
          submitter={{
            onSubmit: onSubmit,
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
            submitButtonProps: {
              style: {
                display: 'none',
              },
            },
          }}
        >
          <FormCustomerSelect
            colProps={{ span: 24 }}
            onChange={(id) => {
              setCustomerId(id);
            }}
            name="customer_id"
            label="会员卡号"
            rules={[{ required: true, message: '请选择客户' }]}
            placeholder="请选择或新建客户"
          />
          <ProFormSelect
            style={{ width: 580 }}
            onChange={(value) => {
              setSelectValue(value);
            }}
            options={selectOpt}
            mode="multiple"
            name="product_items"
            label="本次服务项目"
            required
            disabled={!customerId}
          />
          <Table style={{ marginBottom: 24 }} size="small" pagination={false} bordered columns={[
            {
              title: '服务项目',
              dataIndex: 'coupon_name',
              ellipsis: true,
            },
            {
              title: '数量',
              dataIndex: 'sale_price',
              ellipsis: true,
              render: (_, record) => {
                return record.coupon_type === 'times' ?
                  <Form.Item name={`couponsCount_${record.id}`} initialValue={1} className={style.formItem} required>
                    <InputNumber min={1} max={record.remaining_times} style={{ width: '100%' }} />
                  </Form.Item>
                  : '无'
              },
            },
            {
              title: '服务老师',
              dataIndex: 'remark',
              ellipsis: true,
              render: (_, record) => {
                return <Form.Item name={`teacher_${record.id}`} className={style.formItem} required>
                  <Select style={{ width: '100%' }} options={userSelectOpt} />
                </Form.Item>
              },
            },
          ]}
            dataSource={tableData}
          />
          <ProForm.Group>
            <ProFormSelect
              colProps={{ span: 12 }}
              name="payment_method"
              label="付款方式"
              required
              options={[
                {
                  label: '现金',
                  value: 'cash',
                },
                {
                  label: '电子支付',
                  value: 'ePayment',
                },
                {
                  label: '账户余额',
                  value: 'balance',
                },
              ]}
            />
            <ProFormDigit required min={0} colProps={{ span: 12 }} name="payment_amount" label="金额" />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText colProps={{ span: 12 }} name="remark" label="服务备注" />
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <ProCard bordered colSpan={8} title="客户持卡情况">
        {customerId && <CustomerCouponsList customerId={customerId} />}
      </ProCard>
    </ProCard>
  </Modal>;
};

export default ServiceRegistrationModal;
