import { Modal, ModalProps } from 'antd';
import { FC } from 'react';

import CustomerList from '@/components/CustomerList';

const CustomerListModal: FC<ModalProps> = (props) => {

  return <Modal title="客户管理" footer={null} {...props}>
    <CustomerList
      search={false}
      size='small'
      bordered
      style={{
        height: 600,
        overflow: 'auto',
      }}
    />
  </Modal>;
};

export default CustomerListModal;
