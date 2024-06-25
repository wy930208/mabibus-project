import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormMoney,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components'
import { Link, useRequest } from '@umijs/max';
// import { useRequest } from 'ahooks'
import { Form, message, Space, Tag } from 'antd';
import dayjs from 'dayjs'
import { FC, useMemo, useRef, useState } from 'react';

import DropdownMenu from '@/components/DropdownMenu';
import { columnScrollX, CreateButton, operationColumn } from '@/components/TableColumns';
import { createCustomer, deleteCustomer, getCustomerList, updateCustomer } from '@/services/customer';
import { getStoreList } from '@/services/store';
import { ROUTES } from '@/utils/enums';

const CustomerManagement: FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm<{
    [x: string]: any; name: string; company: string
  }>();

  const { data: storeList = [] } = useRequest(getStoreList, {
    formatResult(resp) {
      return resp.data.map((o: { id: string; store_name: string; }) => ({ value: o.id, label: o.store_name }));
    }
  });

  const tableRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '姓名',
        dataIndex: 'user_name',
        ellipsis: true,
        width: 100,
        fixed: true,
        align: 'center',
      },
      {
        title: '所属店铺',
        width: 200,
        align: 'center',
        dataIndex: 'store_id',
        valueEnum: storeList.reduce((acc: { [x: string]: { text: string; }; }, item: (typeof storeList)[number]) => {
          acc[item.value] = {
            text: item.label
          }
          return acc;
        }, {}),
        valueType: 'select',
        render: (_, record) => record.store_name,
      },
      {
        title: '联系方式',
        align: 'center',
        dataIndex: 'phone',
        copyable: true,
        ellipsis: true,
      },
      {
        title: '邮箱',
        align: 'center',
        width: 200,
        dataIndex: 'email',
      },
      {
        title: '地址',
        width: 300,
        align: 'center',
        dataIndex: 'address',
        search: false,
      },
      {
        title: '余额(元)',
        align: 'right',
        dataIndex: 'amount',
        search: false,
      },
      {
        title: '积分',
        align: 'center',
        dataIndex: 'point',
        search: false,
      },
      {
        title: '累计到店(次)',
        align: 'center',
        dataIndex: 'visit_store_num',
        search: false,
      },
      {
        title: '最近到店时间',
        width: 180,
        align: 'center',
        dataIndex: 'last_visit_store_time',
        search: false,
      },
      {
        title: '下次预约到店时间',
        width: 180,
        align: 'center',
        dataIndex: 'next_visit_store_time',
        search: false,
      },
      {
        title: '状态',
        align: 'center',
        valueType: 'select',
        valueEnum: {
          0: {
            text: '禁止',
          },
          1: {
            text: '启用',
          },
        },
        dataIndex: 'status',
        render: (value) => {
          const enabled = value === 1;
          return <Tag style={{ margin: 0 }} color={enabled ? 'green' : 'red'} >{enabled ? '启用' : '禁用'}</Tag>
        },
      },
      {
        title: '创建时间',
        width: 180,
        align: 'center',
        dataIndex: 'created_time',
        valueType: 'dateTime',
        search: false,
      },
      {
        ...operationColumn,
        width: 140,
        align: 'center',
        render: (_, record) => {
          return <Space size={20}>
            <Link to={`/customer/detail/${record.id}`} key="detail">详情</Link>
            <DropdownMenu
              key="opt"
              pathName={ROUTES.STORE_MANAGEMENT}
              editCallback={() => {
                form.setFieldsValue(record);
                setVisible(true);
              }}
              deleteParams={{
                request: deleteCustomer,
                id: record.id,
              }}
              reloadTable={() => tableRef.current?.reload()}
            />
          </Space>
        },
      },
    ]
  }, [form, storeList]);

  const fetchTableData = async (params: any) => {
    return getCustomerList({ deal: 1, ...params })
  }

  return <PageContainer header={{ title: null }}>
    <ProTable
      actionRef={tableRef}
      request={fetchTableData}
      columns={columns}
      // 工具栏
      toolBarRender={() => [
        <CreateButton
          key="create"
          pathName={ROUTES.STORE_MANAGEMENT}
          callback={() => { setVisible(true) }} />,
      ]}
      scroll={{ x: columnScrollX(columns) }}
    />
    <ModalForm
      title="新建客户"
      width={500}
      grid
      form={form}
      open={visible}
      onFinish={async (values) => {
        const id = form.getFieldValue('id')
        const msgPrix = id ? '更新' : '创建';
        if (id) {
          await updateCustomer({ id, ...values });
        } else {
          await createCustomer(values);
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

      <ProFormText
        colProps={{ span: 24 }}
        name="user_name"
        label="姓名"
        rules={[{ required: true, message: '名称不能为空' }]}
        placeholder="请输入姓名"
      />
      <ProFormText
        rules={[{ required: true, message: '手机号码不能为空' }, { max: 11, message: '手机号码不能超过11位' }]}
        name="phone"
        label="联系方式"
        placeholder="手机号码"
      />
      <ProFormText
        name="address"
        label="家庭地址"
        placeholder="请输入家庭地址"
      />
      <ProForm.Group>
        <ProFormSelect
          options={storeList}
          name="store_id"
          label="所属店铺"
        />
      </ProForm.Group>
      <ProFormText
        colProps={{ span: 24 }}
        name="email"
        label="邮箱"
        placeholder="请输入邮箱"
      />
      <ProFormMoney
        label="余额"
        name="amount"
        locale="cn"
        min={0}
        customSymbol=" CN¥"
      />
      <ProFormDigit
        label="积分"
        name="point"
        min={0}
      />
      <ProForm.Group>
        <ProFormDateTimePicker
          colProps={{ span: 12 }}
          name="last_visit_store_time"
          label="最近到店时间"
          disabled
        />
        <ProFormDateTimePicker
          colProps={{ span: 12 }}
          name="next_visit_store_time"
          label="预约下次到店时间"
          fieldProps={{
            showTime: {
              format: 'HH:mm',
            },
            disabledDate: (current) => current && current < dayjs().startOf('day'),
          }}
        />
      </ProForm.Group>
      <ProFormRadio.Group
        disabled
        initialValue={2}
        label="性别"
        name="sex"
        options={[{
          value: 0,
          label: '女性',
        },
        {
          value: 1,
          label: '男性',
        },
        {
          value: 2,
          label: '隐私',
        },
        ]}
      />
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
    </ModalForm>
  </PageContainer>
}

export default CustomerManagement;
