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
                <el-button type="success" plain>添加用户</el-button>
            </el-col>
        </el-row>
        <el-table
            border
            stripe
            :data="list"
            v-loading="loading"
            style="width: 100%">
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                width="240">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话">
            </el-table-column>
            <el-table-column
                label="日期">
                <template  slot-scope="scope">
                    {{scope.row.create_time |fmDate('YYYY-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                label="用户状态"
                width="90">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.mg_state"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="240"
                >
                <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
                <el-button size="mini" type="success" icon="el-icon-check" plain></el-button>                
            </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: true
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$http.get('users', {
        headers: {
          Authorization: window.sessionStorage.getItem('token')
        },
        params: {
          pagenum: 1,
          pagesize: 10
        }
      })
        .then(response => {
          this.loading = false;
          const {meta: {msg, status}} = response.data;
          if (status === 200) {
            const {data: {users}} = response.data;
            this.list = users;
          } else {
            this.$message.error(msg);
          }
        });
    }
  }
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
