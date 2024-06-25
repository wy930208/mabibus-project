/*
 * @Description: 客户模块
 */
export default {
    path: '/store',
    name: 'store',
    access: 'adminRouteFilter',
    exact: true,
    routes: [
      {
        path: '/store',
        redirect: '/store/list',
        exact: true,
      },
      {
        path: '/store/list',
        name: 'list',
        access: 'adminRouteFilter',
        component: './Store/List',
        exact: true,
      },
    ],
  };