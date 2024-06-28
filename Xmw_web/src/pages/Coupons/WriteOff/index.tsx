import {
  PageContainer,
  ProCard,
} from '@ant-design/pro-components'
import { history, useLocation, useRequest } from '@umijs/max';
import { Button, Flex, Input, message } from 'antd';
import { ChangeEvent, FC, useState } from 'react';

import { fetchCouponsMembersCoupons, writeOffMemberCoupons } from '@/services/coupons';

import WriteOffCouponModal from './components/WriteOffCouponModal';

const CouponsWriteOff: FC = () => {
  const [visible, setVisible] = useState(false);
  const { state } = useLocation() as { state: { write_off_code: string, id: string; } };
  const [code, setCode] = useState(state?.write_off_code);

  const { data, loading, refresh } = useRequest(() => fetchCouponsMembersCoupons(state?.id));

  const onCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  }

  const onWriteCode = async () => {
    await refresh();
    setVisible(true);
  }

  return <PageContainer header={{ title: null }}>
    <ProCard title="核销码">
      <Flex gap={24}>
        <Input value={code} width={300} size='large' placeholder='输入卡券核销码' onChange={onCodeChange} />
        <Button loading={loading} type="primary" size='large' onClick={onWriteCode} disabled={!code} >确定核销</Button>
        <Button
          type="primary"
          size='large'
          onClick={() => history.push('/coupons/members')}
        >返回列表</Button>
      </Flex>
    </ProCard>
    {visible && data?.[0] && <WriteOffCouponModal
      initialValues={data?.[0] as any}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => setVisible(false),
      }}
      onFinish={async (values) => {
        try {
          await writeOffMemberCoupons({
            id: state?.id,
            write_off_code: state?.write_off_code,
            ...values,
          });
          setVisible(false);
          await refresh();
          message.success('核销成功', 1000 * 3);
        } catch (error: any) {
          console.log(error);
          message.error(error?.message);
        }
      }}
      open={visible}
    />}
  </PageContainer>
}

export default CouponsWriteOff;
