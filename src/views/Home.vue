<template>
    <el-container>
        <!-- 头部 -->
        <el-header>
            <el-row>
                <el-col :span="4">
                    <img src="@/assets/logo.png" alt="">
                </el-col>
                <el-col class="middle" :span="19">
                    <span>电商后台管理系统</span>
                </el-col>
                <el-col :span="1">
                    <a href="#" class="loginoutBtn" @click.prevent="handleLoginout">退出</a>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="200px">
                <el-menu
                    :unique-opened="true"
                    :router="true"
                    style="height:100%"
                    default-active="0">
                    <el-submenu
                    v-for="level1 in menus"
                    :key="level1.id"
                    :index="level1.path">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{level1.authName}}</span>
                        </template>
                        <el-menu-item
                        v-for="level2 in level1.children"
                        :key="level2.id"
                        :index="'/'+level2.path">
                            <i class="el-icon-menu"></i>
                            {{level2.authName}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 获取菜单数据
      menus: []
    };
  },
  created() {
    this.loadMenus();
  },
  //   beforeCreate() {
  //     const token = sessionStorage.getItem('token');
  //     if (!token) {
  //       // 未登录提示用户
  //       this.$message.warning('请先登录');
  //       this.$router.push('/login');
  //     }
  //   },
  methods: {
    handleLoginout() {
      // 清除token
      sessionStorage.clear();
      // 提示退出成功
      this.$message.success('退出成功');
      // 跳转到登录页面

      this.$router.push('/login');
    },
    async loadMenus() {
      const response = await this.$http.get('menus');
      const {meta: {msg, status}} = response.data;
      if (status === 200) {
        this.menus = response.data.data;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.el-container{
    height: 100%;
}
.el-aside {
    background-color: #D3DCE6;
    color: #333;
  }
.el-main {
    background-color: #E9EEF3;
    color: #333;
}
.el-header{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    padding:0;
}
.middle{
    font-size: 24px;
    color:#fff;
}
.loginoutBtn{
    color:orangered;
    text-decoration: none;
}
</style>
