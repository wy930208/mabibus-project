import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDateTimePicker,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components'
import { useRequest } from 'ahooks'
import { Button, Form, message, Space, Upload } from 'antd';
import { FC, useMemo, useRef, useState } from 'react';
import { read as xlsxRead, utils as xlsxUtils } from 'xlsx';

import DropdownMenu from '@/components/DropdownMenu';
import { columnScrollX, CreateButton, operationColumn } from '@/components/TableColumns';
import {
  bulkCreateCustomer,
  createCustomer, deleteCustomer, getCustomerList, updateCustomer,
} from '@/services/customer';
import { ROUTES } from '@/utils/enums';
import { Link } from '@umijs/max';

const PotentialCustomer: FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm<{
    [x: string]: any; name: string; company: string
  }>();

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
        title: '联系方式',
        align: 'center',
        width: 140,
        dataIndex: 'phone',
      },
      {
        title: '出生日期',
        width: 140,
        align: 'center',
        dataIndex: 'anniversary',
        valueType: 'date',
      },
      {
        title: '邮箱',
        align: 'center',
        width: 180,
        search: false,
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
        ...operationColumn,
        width: 120,
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
  }, [form]);

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

  const { runAsync: fetchStoreList } = useRequest(() => getCustomerList({deal: 0}), { manual: true });
  return <PageContainer header={{ title: null }}>
    <ProTable
      actionRef={tableRef}
      request={fetchStoreList}
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
          pathName={ROUTES.STORE_MANAGEMENT}
          callback={() => { setVisible(true) }} />,
      ]}
      scroll={{ x: columnScrollX(columns) }}
    />
    <ModalForm
      title="新建潜在客户"
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
