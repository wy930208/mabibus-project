import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormRadio,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components'
import { useRequest } from 'ahooks'
import { Form, message, Switch } from 'antd';
import { FC, useMemo, useRef, useState } from 'react';

import DropdownMenu from '@/components/DropdownMenu';
import { CreateButton, operationColumn } from '@/components/TableColumns';
import { createStore, deleteStore, getStoreList, updateStore } from '@/services/store';
import { ROUTES } from '@/utils/enums';

const StoreManagement: FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm<{
    [x: string]: any; name: string; company: string
  }>();

  const tableRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '店铺名称',
        dataIndex: 'store_name',
        ellipsis: true,
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
        copyable: true,
        ellipsis: true,
      },
      {
        title: '负责人',
        dataIndex: 'store_manager',
      },
      {
        title: '地址',
        dataIndex: 'address',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (value) => {
          return <Switch checked={value === 1} />
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_time',
        valueType: 'dateTime',
      },
      {

        ...operationColumn,
        render: (_, record) => {
          return <DropdownMenu
            pathName={ROUTES.STORE_MANAGEMENT}
            editCallback={() => {
              form.setFieldsValue(record);
              setVisible(true);
            }}
            deleteParams={{
              request: deleteStore,
              id: record.id,
            }}
            reloadTable={() => tableRef.current?.reload()}
          />
        },
      },
    ]
  }, [form])

  const { runAsync: fetchStoreList } = useRequest(getStoreList, { manual: true });
  return <PageContainer header={{ title: null }}>
    <ProTable
      actionRef={tableRef}
      request={fetchStoreList}
      columns={columns}
      // 工具栏
      toolBarRender={() => [
        <CreateButton
          key="create"
          pathName={ROUTES.STORE_MANAGEMENT}
          callback={() => { setVisible(true) }} />,
      ]}
    />
    <ModalForm
      title="新建店铺"
      width={500}
      grid
      form={form}
      open={visible}
      onFinish={async (values) => {
        const id = form.getFieldValue('id')
        const msgPrix = id ? '更新' : '创建';

        if (id) {
          await updateStore({ id, ...values });
        } else {
          await createStore(values);
        }
        
        message.success(`${msgPrix}成功`);
        setVisible(false);
        tableRef.current?.reload();
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => setVisible(false),
      }}
    >
      <ProForm.Group>
        <ProFormText
          colProps={{ span: 24 }}
          name="store_name"
          label="店铺名称"
          rules={[{ required: true, message: '店铺名称不能为空' }]}
          placeholder="请输入名称"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          name="phone"
          label="联系方式"
          placeholder="手机号码"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          name="store_manager"
          label="负责人"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          name="address"
          label="地址"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          initialValue={1}
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

        {/* <ProFormSwitch initialValue={true} label="状态" name="status" /> */}
      </ProForm.Group>
    </ModalForm>
  </PageContainer>
}

export default StoreManagement;
