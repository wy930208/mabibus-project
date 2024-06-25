/*
 * @Description: 客户模块
 */
export default {
  path: '/customer',
  name: 'customer',
  access: 'adminRouteFilter',
  exact: true,
  routes: [
    {
      path: '/customer',
      redirect: '/customer/management',
      exact: true,
    },
    {
      path: '/customer/management',
      name: 'management',
      component: './Customer/Management',
    //   access: 'adminRouteFilter',
      exact: true,
    },
    {
      path: '/customer/detail/:id',
      name: 'customer-detail',
      component: './Customer/Detail',
      i18nKey: 'menu.customer.customer-detail',
      state: {
        name: 11,
      },
      // access: 'adminRouteFilter',
      exact: true,
    },
    {
      path: '/customer/potential-customer',
      name: 'potential-customer',
      component: './Customer/PotentialCustomer',
      // access: 'adminRouteFilter',
      exact: true,
    },
  ],
};