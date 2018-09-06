<template>
    <el-card class="card">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row class="row">
            <el-col :span="24">
                <el-input  clearable v-model="searchVal" style="width:300px" placeholder="请输入内容" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
                <el-button @click="addUserDialogFormVisible = true" type="success" plain>添加用户</el-button>
            </el-col>
        </el-row>
        <el-table
            border
            stripe
            :data="tableData"
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
                        @change="handleChange(scope.row)"
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
                    <el-button size="mini" type="primary" icon="el-icon-edit" plain  @click="handleOpenEditDialog(scope.row)"></el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" plain @click="handleDelete(scope.row.id)"></el-button>
                    <el-button size="mini" type="success" icon="el-icon-check" plain></el-button>
            </template>
            </el-table-column>
        </el-table>
        <!-- size-change  pageSize 改变时会触发 -->
        <!-- current-change  currentPage 改变时会触发 -->
        <!-- page-sizes每页显示个数选择器的选项设置 -->
        <!-- page-size每页显示条目个数 -->
        <!-- layout组件布局，子组件名用逗号分隔 -->
        <el-pagination
            style="margin-top:15px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[2, 3, 4, 5]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="addUserDialogFormVisible" @close="handleClose">
            <el-form
            ref="form"
            :rules="rules"
            label-width="80px"
            :model="formData">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="formData.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="formData.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
                <el-input v-model="formData.mobile" auto-complete="off"></el-input>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAdd">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog title="编辑用户" :visible.sync="editUserDialogFormVisible" @close="handleClose">
            <el-form
            label-width="80px"
            :model="formData">
            <el-form-item label="用户名">
                <el-input v-model="formData.username" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="formData.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="formData.mobile" auto-complete="off"></el-input>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      loading: true,
      pagenum: 1,
      pagesize: 2,
      total: 0,
      searchVal: '',
      addUserDialogFormVisible: false,
      editUserDialogFormVisible: false,
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // 拿到token
      const token = sessionStorage.getItem('token');
      // 设置请求头
      this.$http.defaults.headers.common['Authorization'] = token;
      const response = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`);
      // 请求结束设置loading
      this.loading = false;
      const {meta: {status, msg}} = response.data;
      if (status === 200) {
        this.tableData = response.data.data.users;
        this.total = response.data.data.total;
      } else {
        this.$message.error(msg);
      }
    },
    // 分页方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    // 搜索方法
    handleSearch() {
      this.loadData();
    },
    // 删除方法
    handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 点击了确定按钮
        const response = await this.$http.delete(`users/${id}`);
        const {meta: {status, msg}} = response.data;
        if (status === 200) {
          this.$message.success(msg);
          // 如果删除的数据是最后一页并且只有一条数据,那么删除后会出现问题
          if (this.pagenum > 1 && this.tableData.length === 1) {
            this.pagenum--;
          }
          this.loadData();
        } else {
          this.$message.error(msg);
        }
      }).catch(() => {
        // 点击了取消按钮
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async handleChange(user) {
      const response = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      const {meta: {status, msg}} = response.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // async handleAdd() {
    //   const response = await this.$http.post('users', this.formData);
    //   const {meta: {status, msg}} = response.data;
    //   if (status === 201) {
    //     this.$message.success(msg);
    //     // 刷新表格
    //     this.loadData();
    //     // 关闭对话框
    //     this.addUserDialogFormVisible = false;
    //     // 清空文本框
    //   } else {
    //     this.$message.error(msg);
    //   }
    // },
    handleAdd() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) {
          this.$message.warning('验证失败');
          return;
        }
        const response = await this.$http.post('users', this.formData);
        const {meta: {status, msg}} = response.data;
        if (status === 201) {
          this.$message.success(msg);
          // 刷新表格
          this.loadData();
          // 关闭对话框
          this.addUserDialogFormVisible = false;
          // 清空文本框
        } else {
          this.$message.error(msg);
        }
      });
    },
    handleClose() {
      for (let k in this.formData) {
        this.formData[k] = '';
      }
    },
    // 编辑方法
    handleOpenEditDialog(user) {
      // 打开编辑用户信息框
      this.editUserDialogFormVisible = true;
      // 设置formData的值
      this.formData.username = user.username;
      this.formData.email = user.email;
      this.formData.mobile = user.mobile;
      // 点击的时候获得当前点击用户的id
      this.formData.id = user.id;
    },
    async handleEdit() {
      const response = await this.$http.put(`users/${this.formData.id}`, {
        email: this.formData.email,
        mobile: this.formData.mobile
      });
      const {meta: {status, msg}} = response.data;
      if (status === 200) {
        this.editUserDialogFormVisible = false;
        this.$message.success(msg);
        this.loadData();
      } else {
        this.$message.error(msg);
      }
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
