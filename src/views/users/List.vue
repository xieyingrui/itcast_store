<template>
    <el-card class="card">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row class="row">
            <el-col :span="24">
                <el-input style="width:300px" placeholder="请输入内容" v-model="input5" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
export default {

};
</script>

<style>
    .card{
        height: 100%;
    }
    .row {
        margin:20px 0;
    }
</style>
