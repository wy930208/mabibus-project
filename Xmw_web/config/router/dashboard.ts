export default {
  path: '/dashboard',
  name: 'dashboard',
  access: 'adminRouteFilter',
  exact: true,
  routes: [
    {
      path: '/dashboard',
      redirect: '/dashboard/work-bench',
      exact: true,
    },
    {
      path: '/dashboard/work-bench',
      name: 'work-bench',
      component: './Dashboard/Workbench',
      access: 'adminRouteFilter',
      exact: true,
    },
  ],
};
