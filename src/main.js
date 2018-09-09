// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
import '@/assets/css/index.css';
import MyHttp from '@/plugins/MyHttp.js';
import Moment from 'moment';
import MyBreadcrumb from '@/components/MyBreadcrumb';

// 过滤器,格式化日期
Vue.filter('fmDate', (value, fmstr) => {
  return Moment(value).format(fmstr);
});

// 注册MyHttp插件
Vue.use(MyHttp);
Vue.use(ElementUI);

Vue.config.productionTip = false;

// 全局注册面包屑组件
Vue.component(MyBreadcrumb.name, MyBreadcrumb);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
