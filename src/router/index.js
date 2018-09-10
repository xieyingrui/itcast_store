import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/views/Login';
import Home from '@/views/Home';
import Users from '@/views/users/List';
import Rights from '@/views/rights/Rights';
import Roles from '@/views/rights/Roles';
import Categories from '@/views/goods/Categories';
import {Message} from 'element-ui';

Vue.use(Router);
const router = new Router({
  routes: [
    {name: 'login', path: '/login', component: Login},
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {name: 'users', path: '/users', component: Users},
        {name: 'rights', path: '/rights', component: Rights},
        {name: 'roles', path: '/roles', component: Roles},
        {name: 'categories', path: '/categories', component: Categories}
      ]
    }
  ]
});
// 设置路由的前置守卫(路由跳转之前)
router.beforeEach((to, from, next) => {
  // 判断有没有token
  if (to.name === 'login') {
    next();
  } else {
    const token = sessionStorage.getItem('token');
    if (token) {
      next();
    } else {
      // 没有token,跳转到登录页面
      router.push('/login');
      // 提示
      Message.warning('请先登录');
    }
  }
});
export default router;
