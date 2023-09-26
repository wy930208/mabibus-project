/*
 * @Description: 入口文件-全局 layout 配置
 * @Version: 2.0
 * @Author: 白雾茫茫丶
 * @Date: 2022-09-19 20:39:53
 * @LastEditors: 白雾茫茫丶
 * @LastEditTime: 2023-09-26 14:53:15
 */
import { SettingDrawer, Settings as LayoutSettings, ProConfigProvider } from '@ant-design/pro-components';
import { history, InitDataType, Link, RunTimeLayoutConfig } from '@umijs/max';
import { useBoolean } from 'ahooks'
import { ConfigProvider, Space, Typography } from 'antd'
import { isEmpty, last } from 'lodash-es'

import Footer from '@/components/Footer'; // 全局底部版权组件
import { getLocalStorageItem, setLocalStorageItem } from '@/utils'
import { IconFont } from '@/utils/const'
import { LOCAL_STORAGE, ROUTES } from '@/utils/enums'

import { actionsRender, appList, avatarProps, LockScreenModal, LockSleep } from './components'

const { Paragraph } = Typography;

export const BasiLayout: RunTimeLayoutConfig = ({ initialState, setInitialState }: InitDataType) => {
	/* 获取 LAYOUT 的值 */
	const LAYOUT = getLocalStorageItem<LayoutSettings>(LOCAL_STORAGE.LAYOUT)
	/* 是否显示锁屏弹窗 */
	const [openLockModal, { setTrue: setLockModalTrue, setFalse: setLockModalFalse }] = useBoolean(false)

	return {
		/* 菜单图标使用iconfont */
		iconfontUrl: process.env.ICONFONT_URL,
		/* 水印 */
		waterMarkProps: {
			content: initialState?.CurrentUser?.cn_name,
		},
		/* 用户头像 */
		avatarProps: avatarProps(setLockModalTrue),
		/* 自定义操作列表 */
		actionsRender,
		/* 底部版权 */
		footerRender: () => <Footer />,
		/* 页面切换时触发 */
		onPageChange: (location) => {
			const pathname = location?.pathname || ''
			// 如果没有登录，重定向到 login
			if (isEmpty(initialState?.CurrentUser) && pathname !== ROUTES.LOGIN) {
				history.push(ROUTES.LOGIN);
			}
		},
		menu: {
			request: async () => initialState?.RouteMenu,
		},
		/* 自定义面包屑 */
		breadcrumbProps: {
			itemRender: (route) => {
				return (
					<Space>
						<IconFont type={`icon-${last(route.linkPath.split('/'))}`} />
						<span>{route.breadcrumbName}</span>
					</Space>
				)
			},
		},
		/* 自定义菜单项的 render 方法 */
		menuItemRender: (menuItemProps, defaultDom) => {
			const renderMenuDom = () => {
				return (
					<>
						{/* 分组布局不用渲染图标，避免重复 */}
						{!(LAYOUT?.siderMenuType === 'group') &&
							menuItemProps.pro_layout_parentKeys?.length &&
							<IconFont type={menuItemProps.icon} style={{ marginRight: 10 }} />}
						<Paragraph
							ellipsis={{ rows: 1, tooltip: defaultDom }}
							style={{ marginBottom: 0 }}>
							{defaultDom}
						</Paragraph>
					</>
				)
			}
			return (
				/* 渲染二级菜单图标 */
				menuItemProps.isUrl ?
					<a
						href={menuItemProps.path}
						target="_blank"
						style={{ display: 'flex', alignItems: 'center' }}>
						{renderMenuDom()}
					</a> :
					<Link to={menuItemProps.path || '/'} style={{ display: 'flex', alignItems: 'center' }}>
						{renderMenuDom()}
					</Link>
			);
		},
		// 菜单的折叠收起事件
		onCollapse: (collapsed) => {
			setInitialState((preInitialState) => ({ ...preInitialState, Collapsed: collapsed }));
		},
		// 跨站点导航列表
		appList,
		// 增加一个 loading 的状态
		childrenRender: (children) => {
			return (
				<>
					<ProConfigProvider>
						<ConfigProvider>
							{children}
							{/* 锁屏弹窗 */}
							<LockScreenModal open={openLockModal} setOpenFalse={setLockModalFalse} />
							{/* 睡眠弹窗 */}
							<LockSleep />
						</ConfigProvider>
						<SettingDrawer
							disableUrlParams
							enableDarkTheme
							settings={LAYOUT}
							onSettingChange={(Settings: LayoutSettings) => {
								setLocalStorageItem(LOCAL_STORAGE.LAYOUT, { ...initialState?.Settings, ...Settings })
								setInitialState((preInitialState) => ({ ...preInitialState, Settings }));
							}}
						/>
					</ProConfigProvider>
				</>
			);
		},
		...LAYOUT,
	};
}