<template>
    <div class="login-wrap">
        <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
            <h2>用户登录</h2>
            <el-form-item label="用户名">
                <el-input v-model="formData.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" @keyup.enter.native="handleLogin" v-model="formData.password"></el-input>
            </el-form-item>
            <el-button class="loginBtn" type="primary" @click="handleLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>
// 1.绑定表单数据
// 2.给按钮添加点击事件,发送请求
// 3.登陆成功,返回提示信息,记录token
export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    handleLogin() {
      this.$http.post('login', this.formData)
        .then(response => {
          //  console.log(response);
          const {meta: {msg, status}} = response.data;
          if (status === 200) {
            // 成功
            this.$message.success(msg);
            sessionStorage.setItem('token', response.data.data.token);
            // 跳转到home页面
            this.$router.push('/');
          } else {
            // 失败
            this.$message.error(msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.login-wrap{
    background-color: #324152;
    display:flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.login-form{
    width: 500px;
    padding:30px;
    background-color: #fff;
    border-radius: 5px;
}
.loginBtn{
    width: 100%;
}
</style>
