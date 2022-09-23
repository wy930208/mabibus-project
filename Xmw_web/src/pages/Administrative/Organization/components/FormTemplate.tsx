/*
 * @Description: 新建表单
 * @Version: 2.0
 * @Author: Cyan
 * @Date: 2022-09-13 11:33:11
 * @LastEditors: Cyan
 * @LastEditTime: 2022-09-23 10:27:38
 */

// 引入第三方库
import { FC, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';// antd 图标
import { DrawerForm } from '@ant-design/pro-components'; // 高级组件
import { Button, Form, message } from 'antd'; // antd 组件库

// 引入业务组件
import FormTemplateItem from '../components/FormTemplateItem' // 表单组件 
import { saveOrganization } from '@/services/administrative/organization' // 组织管理接口
import { FormTemplateProps } from '../utils/interface' // 公共 interface
import { formatMessage } from '@/utils' // 引入工具类

const FormTemplate: FC<FormTemplateProps> = ({ treeData, reloadTable, formData, triggerDom, parent_id }) => {
    // 初始化表单
    const [form] = Form.useForm<API.ORGANIZATION>();
    // 深克隆一份表单数据
    const [cloneFormData, setCloneFormData] = useState<API.ORGANIZATION | undefined>(formData)
    // 表单标题
    const formTitle = cloneFormData && cloneFormData.org_id ? `${formatMessage(['global.table.operation.edit', 'pages.administrative.organization.title'])}：${cloneFormData.org_name}` : formatMessage(['global.table.operation.add', 'pages.administrative.organization.title'])
    // 提交表单
    const handlerSubmit = async (values: any) => {
        // 提交数据
        let result = false
        const params = { ...cloneFormData, ...values }
        parent_id && (params.parent_id = parent_id)
        // 删除 children 属性
        params.children && delete params.children
        await saveOrganization(params).then(res => {
            if (res.resCode === 200) {
                message.success(res.resMsg);
                reloadTable()
                // 重置表单
                form.resetFields()
                result = true
            }
        })
        return result
    }
    return (
        <DrawerForm<API.ORGANIZATION>
            title={formTitle}
            width={500}
            grid
            form={form}
            trigger={triggerDom ||
                <Button type="primary">
                    <PlusOutlined />
                    {formatMessage('global.table.operation.add')}
                </Button>
            }
            autoFocusFirstInput
            drawerProps={{
                destroyOnClose: false,
                maskClosable: false,
                onClose: () => form.resetFields()
            }}
            // 提交数据时，禁用取消按钮的超时时间（毫秒）。
            submitTimeout={2000}
            onFinish={async (values) => {
                // 提交数据
                const isSuccess = await handlerSubmit(values)
                // 返回true关闭弹框，否则不关闭
                return isSuccess
            }}
            onVisibleChange={visiable => {
                if (visiable) {
                    form.setFieldsValue(formData);
                    setCloneFormData(formData)
                }
            }}
        >
            <FormTemplateItem treeData={treeData} parent_id={parent_id} />
        </DrawerForm>
    );
};

export default FormTemplate