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
                    <el-submenu index="1">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>用户管理</span>
                        </template>
                        <el-menu-item index="/users">
                            <i class="el-icon-menu"></i>
                            用户列表
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>权限管理</span>
                        </template>
                        <el-menu-item index="/roles">
                            <i class="el-icon-menu"></i>
                            角色列表
                        </el-menu-item>
                        <el-menu-item index="rights">
                            <i class="el-icon-menu"></i>
                            权限列表
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>商品管理</span>
                        </template>
                        <el-menu-item index="2-1">
                            <i class="el-icon-menu"></i>
                            商品列表
                        </el-menu-item>
                        <el-menu-item index="2-1">
                            <i class="el-icon-menu"></i>
                            分类参数
                        </el-menu-item>
                        <el-menu-item index="2-1">
                            <i class="el-icon-menu"></i>
                            商品分类
                        </el-menu-item>
                    </el-submenu>                    
                </el-menu>
            </el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    beforeCreate(){
        const token =sessionStorage.getItem('token');
        if(!token){
            //未登录提示用户
            this.$message.warning('请先登录');
            this.$router.push('/login');
        }
    },
    methods:{
        handleLoginout(){
            //清除token
            sessionStorage.clear();
            //提示退出成功
            this.$message.success('退出成功');
            // 跳转到登录页面
            this.$router.push('/login');
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
    text-align: center;
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
