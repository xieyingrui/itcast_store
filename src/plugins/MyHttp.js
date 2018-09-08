import axios from 'axios';
const MyHttp = {};
MyHttp.install = function(Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    // 在请求发送之前,添加请求头token
    // 如果请求的地址是login时候不用加请求头token
    if (config.url !== 'login') {
      const token = sessionStorage.getItem('token');
      // 设置请求头
      config.headers.Authorization = token;
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });
  Vue.prototype.$http = axios;
};
export default MyHttp;
