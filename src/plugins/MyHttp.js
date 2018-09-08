import axios from 'axios';
import { Loading } from 'element-ui';
const MyHttp = {};
MyHttp.install = function(Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
  // 添加请求拦截器
  let loadingInstance=null;
  axios.interceptors.request.use(function (config) {
    // 1.在请求发送之前,添加请求头token
    // 如果请求的地址是login时候不用加请求头token
    if (config.url !== 'login') {
      const token = sessionStorage.getItem('token');
      // 设置请求头
      config.headers.Authorization = token;
    }
    //2.显示loading
    // this.$loading();
    loadingInstance=Loading.service();
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    //隐藏加载提示
    loadingInstance.close();
    return response;
  }, function (error) {
    return Promise.reject(error);
  });
  Vue.prototype.$http = axios;
};
export default MyHttp;
