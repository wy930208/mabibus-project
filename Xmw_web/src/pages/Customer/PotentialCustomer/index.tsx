import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDateTimePicker,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components'
import { Button, Form, message, Space, Switch, Upload } from 'antd';
import { FC, useMemo, useRef, useState } from 'react';
import { read as xlsxRead, utils as xlsxUtils } from 'xlsx';

import DropdownMenu from '@/components/DropdownMenu';
import { columnScrollX, CreateButton, operationColumn } from '@/components/TableColumns';
import { createMembersCoupons } from '@/services/coupons';
import {
  bulkCreateCustomer,
  createCustomer, deleteCustomer, getCustomerList, updateCustomer,
} from '@/services/customer';
import { formatResponse } from '@/utils';
import { ROUTES } from '@/utils/enums';

import CustomerDetail from '../Detail'
import ChoosePackageModal from './components/ChoosePackageModal';

const PotentialCustomer: FC = () => {
  const [visible, setVisible] = useState(false);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [packageModalVisible, setPackageModalVisible] = useState(false);
  const [record, setRecord] = useState<any>();

  const [form] = Form.useForm<{
    [x: string]: any; name: string; company: string
  }>();

  const [logFrom] = Form.useForm<{
    [x: string]: any; name: string; company: string
  }>();

  const tableRef = useRef<ActionType>();

  const onCustomerUpdate = async (value: Record<string, any>, record: Record<string, any>) => {
    const payload = {
      id: record.id,
      ...value,
    }
    await updateCustomer(payload);
    tableRef.current?.reload();
  }

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
        title: '联系方式',
        align: 'center',
        width: 120,
        dataIndex: 'phone',
      },
      {
        title: '出生日期',
        width: 120,
        align: 'center',
        dataIndex: 'anniversary',
        valueType: 'date',
      },
      {
        title: '已添加微信',
        width: 100,
        align: 'center',
        dataIndex: 'add_wechat',
        valueEnum: {
          0: { text: '未添加', status: 'Default' },
          1: { text: '已添加', status: 'Processing' },
        },
        search: true,
        render: (_, record) => {
          return <Switch checked={record.add_wechat} onChange={(value) => onCustomerUpdate({
            add_wechat: value ? 1 : 0,
          }, record)} />
        },
      },
      {
        title: '是否可上门',
        width: 100,
        align: 'center',
        dataIndex: 'can_go_house',
        valueEnum: {
          1: { text: '可上门', status: 'Default' },
          0: { text: '不可上门', status: 'Processing' },
        },
        render: (_, record) => {
          return <Switch checked={record.can_go_house} onChange={(value) => onCustomerUpdate({
            can_go_house: value ? 1 : 0,
          }, record)} />
        },
      },
      {
        title: '套餐',
        width: 100,
        align: 'center',
        search: false,
        dataIndex: 'will_purchase',
        render: (_, record) => {
          return <Button onClick={() => {
            setRecord(record);
            setPackageModalVisible(true);
          }}>选择套餐</Button>
        },
      },
      {
        title: '家庭地址',
        width: 200,
        align: 'center',
        dataIndex: 'address',
        ellipsis: true,
        search: false,
      },
      {
        ...operationColumn,
        width: 120,
        render: (_, record) => {
          return <Space size={20}>
            <Button onClick={() => {
              setRecord(record);
              setLogModalVisible(true);
            }} key="detail">跟踪</Button>
            <DropdownMenu
              key="opt"
              pathName={ROUTES.CUSTOMER_MANAGEMENT}
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
  }, [form]);

  const fetchTableData = async (params: any) => {
    return getCustomerList({ deal: 0, ...params })
  }

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = xlsxRead(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = xlsxUtils.sheet_to_json(worksheet);
      message.success('Excel文件解析成功！');
      await bulkCreateCustomer(jsonData);

      tableRef.current?.reload();

      console.log(jsonData); // 这里可以处理你的JSON数据
    };
    reader.onerror = (error) => {
      message.error('文件读取出错: ' + error);
    };
    reader.readAsArrayBuffer(file);
  };
  const uploadProps = useMemo(() => {
    return {
      beforeUpload: (file: File) => {
        handleFile(file);
        return false; // 阻止自动上传
      },
      showUploadList: false,
    }
  }, []);

  return <PageContainer header={{ title: null }}>
    <ProTable
      actionRef={tableRef}
      request={fetchTableData}
      columns={columns}
      // 工具栏
      toolBarRender={() => [
        <Upload
          name="file"
          key="excel"
          {...uploadProps}
        >
          <Button type="primary">导入</Button>
        </Upload>,
        <CreateButton
          key="create"
          pathName={ROUTES.CUSTOMER_MANAGEMENT}
          callback={() => { setVisible(true) }} />,
      ]}
      scroll={{ x: columnScrollX(columns) }}
    />
    {logModalVisible && <CustomerDetail
      title="跟踪记录"
      width={500}
      initialValues={record}
      open={logModalVisible}
      onCancel={() => {
        setLogModalVisible(false)
      }}
    />}

    {packageModalVisible && <ChoosePackageModal
      title="选择套餐"
      initialValues={record}
      open={packageModalVisible}
      onFinish={async (values) => {
        createMembersCoupons({
          ...values,
          quantity: 1,
          customers: [record?.id],
        });
        setPackageModalVisible(false);
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => setPackageModalVisible(false),
      }}
    />}

    <ModalForm
      title="新建潜在客户"
      width={500}
      grid
      form={logFrom}
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
      <ProFormText
        colProps={{ span: 24 }}
        name="email"
        label="邮箱"
        placeholder="请输入邮箱"
      />
      <ProFormDateTimePicker
        colProps={{ span: 12 }}
        name="anniversary"
        label="出生日期"
        fieldProps={{
          showTime: false,
          format: 'YYYY-MM-DD',
        }}
      />
    </ModalForm>
  </PageContainer>
}

export default PotentialCustomer;
