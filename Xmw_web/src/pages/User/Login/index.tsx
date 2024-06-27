/*
 * @Description: 登录页
 * @Version: 2.0
 * @Author: 白雾茫茫丶
 * @Date: 2022-09-08 11:09:03
 * @LastEditors: 白雾茫茫丶
 * @LastEditTime: 2023-10-17 13:51:38
 */

import { LoginForm } from '@ant-design/pro-components';
import { history, SelectLang, useIntl, useModel } from '@umijs/max'
import { useDebounceFn, useRequest } from 'ahooks';
import { App, Col, Row, Tabs, TabsProps, Typography } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { FC, useState } from 'react';

import Footer from '@/components/Footer'; // 全局页脚
import { Login } from '@/services/logic/login' // 登录相关接口
import { encryptionAesPsd, formatPerfix, initUserAuthority, isSuccess, setLocalStorageItem, timeFix } from '@/utils'
import { IconFont } from '@/utils/const'
import { LOCAL_STORAGE, LOGIN_TYPE, ROUTES } from '@/utils/enums'
import type { InitialStateTypes } from '@/utils/types'
import type { LoginParams, LoginType } from '@/utils/types/login'

import Account from './components/Account' // 账户密码登录
import Mobile from './components/Mobile' // 手机号码登录
import styles from './index.module.less'; // css 样式恩建

const LoginPage: FC = () => {
  dayjs.extend(relativeTime);
  const { formatMessage } = useIntl();
  // 初始化状态
  const { initialState, setInitialState } = useModel('@@initialState');
  // hooks 调用
  const { notification, message } = App.useApp();
  // 用户登录类型
  const [loginType, setLoginType] = useState<LoginType>(LOGIN_TYPE.ACCOUNT);
  /**
   * @description: 用户登录接口
   * @Author: 白雾茫茫丶
   */
  const { run: runLogin, loading: loginLoading } = useRequest(async (params) => await Login(params),
    {
      manual: true,
      onSuccess: async ({ code, data }) => {
        if (isSuccess(code)) {
          // 获取登录 token
          const { access_token, login_last_time } = data
          // 将 token 保存到localstorage
          setLocalStorageItem(LOCAL_STORAGE.ACCESS_TOKEN, access_token)
          // 加载用户信息和权限
          await initUserAuthority().then(async (result) => {
            // 将用户权限信息保存到全局
            await setInitialState((s: InitialStateTypes) => ({ ...s, ...result })).then(() => {
              setTimeout(() => {
                // 路由跳转
                const urlParams = new URL(window.location.href).searchParams;
                history.push(urlParams.get('redirect') || '/');
                // 欢迎语
                notification.success({
                  message: `${timeFix()}，${result?.CurrentUser?.cn_name} 💕`,
                  description: login_last_time ?
                    <span>
                      {formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'success.last-time') })}
                      <Typography.Text strong>{dayjs(login_last_time).fromNow()}</Typography.Text>
                    </span>
                    :
                    <Typography.Text strong>
                      {formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'success.first-login') })}
                    </Typography.Text>,
                  icon:
                    <IconFont
                      type="icon-huanyingye"
                      style={{ color: initialState?.Settings?.colorPrimary, fontSize: '24px' }} />,
                })
              }, 0)
            });
          })
        }
      },
    },
  )

  /**
   * @description: 登录表单提交
   * @param {LoginParams} values
   * @Author: 白雾茫茫丶
   */
  const { run: handleSubmit } = useDebounceFn(
    async (values: LoginParams): Promise<void> => {
      try {
        // 如果是账号密码登录，密码加密提交
        if (loginType === LOGIN_TYPE.ACCOUNT && values.password) {
          values.password = encryptionAesPsd(values.password)
        }
        // 如果是手机登录
        if (loginType === LOGIN_TYPE.MOBILE && values.captcha !== '1234') {
          message.error(formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'type.mobile.captcha.failure') }))
          return
        }
        // 调用登录接口
        runLogin({ ...values, type: loginType })
      } catch (error) {
        message.error(formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'failure') }));
      }
    },
    {
      wait: 300,
    },
  );

  /**
   * @description: Tabs 标签页配置
   * @Author: 白雾茫茫丶
   */
  const TbasItems: TabsProps['items'] = [
    {
      label: formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'type.account') }),
      key: LOGIN_TYPE.ACCOUNT,
      children: <Account />,
    },
    {
      label: formatMessage({ id: formatPerfix(ROUTES.LOGIN, 'type.mobile') }),
      key: LOGIN_TYPE.MOBILE,
      children: <Mobile />,
    },
  ]

  return (
    <div className={styles.container}>
      {/* 国际化下拉框 */}
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang reload={false} />}
      </div>
      <Row justify="center" className={styles.content}>
        {/* 左侧背景 */}
        <Col className={styles['login-left']}>
          <div className={styles['login-bg']} />
        </Col>
        <Col className={styles['login-form']}>
          {/* 登录表单 */}
          <LoginForm
            logo={<img alt="logo" src="/logo.svg" />}
            title={initialState?.Settings?.title}
            submitter={{
              submitButtonProps: {
                loading: loginLoading,
              },
            }}
            onFinish={async (values) => {
              await handleSubmit(values as LoginParams);
            }}
          >
            <Tabs
              destroyInactiveTabPane
              centered
              activeKey={loginType}
              onChange={(activeKey) => setLoginType(activeKey as LoginType)}
              items={TbasItems}
            />
          </LoginForm>
        </Col>
      </Row>
      {/* 底部版权 */}
      <Footer />
    </div>
  );
};

export default LoginPage;
