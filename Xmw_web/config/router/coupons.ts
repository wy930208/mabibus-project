/*
 * @Description: 卡券
 */
export default {
  path: '/coupons',
  name: 'coupons',
  // access: 'adminRouteFilter',
  exact: true,
  routes: [
    {
      path: '/coupons',
      redirect: '/coupons/list',
      exact: true,
    },
    {
      path: '/coupons/list',
      name: 'list',
      // access: 'adminRouteFilter',
      component: './Coupons/List',
      exact: true,
    },
  ],
};
