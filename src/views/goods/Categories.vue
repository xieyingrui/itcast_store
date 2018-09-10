<template>
    <el-card class="card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
        <!-- 按钮 -->
        <el-button type="primary" plain style="margin-top:10px;margin-bottom:10px" @click="handleOpenAddDialog">添加分类</el-button>
        <!-- 表格 -->
        <el-table
            border
            stripe
            :height="500"
            :data="tableData"
            style="width: 100%">
            <!-- treeKey 设置每一项的唯一标识
            indentSize 设置不同级别之间的缩进  -->
            <el-table-tree-column
                treeKey="cat_id"
                parentKey="cat_pid"
                levelKey="cat_level"
                :indentSize="20"
                prop="cat_name"
                label="分类名称"
                width="300">
            </el-table-tree-column>
            <el-table-column
                prop="cat_level"
                label="级别"
                width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_level===0">一级</span>
                    <span  v-if="scope.row.cat_level===1">二级</span>
                    <span  v-if="scope.row.cat_level===2">三级</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="cat_deleted"
                label="是否有效">
                <template slot-scope="scope">
                    {{ scope.row.cat_deleted ?'无效':'有效' }}
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scoped">
                    <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
                    <el-button size="mini" type="success" icon="el-icon-check" plain></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <!-- 添加的弹出对话矿 -->
        <el-dialog title="添加商品分类" :visible.sync="addDialogFormVisible">
            <el-form label-width="80px" :model="form">
                <el-form-item label="分类名称">
                <el-input v-model="form.cat_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                <!-- 多级下拉框 -->
                <el-cascader
                    clearable
                    change-on-select=true
                    expand-trigger="hover"
                    :options="options"
                    :props="{label:'cat_name',value:'cat_id',children:'children'}"
                    v-model="selectedOptions">
                </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
// 配置tree grid局部组件
import EleTreeGrid from 'element-tree-grid';
export default {
  components: {
    'el-table-tree-column': EleTreeGrid
  },
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      // 控制添加对话矿的显示隐藏
      addDialogFormVisible: false,
      form: {
        cat_name: ''
      },
      // 绑定多级下拉框
      options: [],
      selectedOptions: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // 加载商品分类数据
      const response = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      const {meta: {msg, status}} = response.data;
      if (status === 200) {
        this.tableData = response.data.data.result;
        // 获取响应后设置total
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
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.loadData();
    },
    // 点击添加按钮,弹出添加对话矿,加载多级下拉框数据
    async handleOpenAddDialog() {
      this.addDialogFormVisible = true;
      const response = await this.$http.get('categories?type=2');
      this.options = response.data.data;
    },
    // 点击确定按钮,添加分类
    async handleAdd() {
      const cat_level = this.selectedOptions.length;

      if (this.selectedOptions.length === 0) {
        // 要添加一级分类
        this.form.cat_pid = 0;
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0];
      } else if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1];
      }
      //发送异步请求
      const response=await this.$http.post('categories',this.form);
      const {meta:{msg,status}}=response.data;
      if(status===201){
          this.$message.success(msg);
          this.addDialogFormVisible=false;
          this.loadData();
      }else{
          this.$message.error(msg);
      }
    }
  }
};
</script>

<style>

</style>
