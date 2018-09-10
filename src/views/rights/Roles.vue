<template>
   <el-card class="card">
       <!-- 面包屑 -->
        <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
        <!-- 按钮 -->
        <el-button style="margin-top:10px;margin-bottom:10px">添加角色</el-button>
        <!-- 表格 -->
        <el-table
            border
            stripe
            :data="tableData"
            style="width: 100%">
            <!-- 展开行 -->
            <el-table-column
            type="expand">
                <template slot-scope="scope">
                    <!-- 一级权限 -->
                    <el-row
                        v-for="level1 in scope.row.children"
                        :key="level1.id">
                        <el-col :span="4">
                            <!-- 显示一级权限的名字 -->
                            <el-tag
                            closeable
                            @close="handleClose(scope.row,level1.id)">{{ level1.authName }}</el-tag>
                        </el-col>
                        <el-col :span="20">
                            <!-- 二级权限 -->
                            <el-row
                            v-for="level2 in level1.children"
                            :key="level2.id">
                                <el-col :span="4">
                                    <!-- 显示二级权限的名称 -->
                                    <el-tag
                                    @close="handleClose(scope.row,level2.id)"
                                    closeable
                                    type="success">
                                        {{level2.authName}}
                                    </el-tag>
                                </el-col>
                                <el-col :span="20">
                                    <!-- 三级权限 -->
                                    <el-tag
                                    @close="handleClose(scope.row,level3.id)"
                                    style="margin-right:5px;margin-bottom:5px"
                                    closable
                                    type="warning"
                                    v-for="level3 in level2.children"
                                    :key="level3.id">
                                        {{level3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 未分配权限 -->
                    <el-row v-if="scope.row.children.length===0">
                        <el-col :span="24">没有分配权限</el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column
            type="index"
                width="60">
            </el-table-column>
            <el-table-column
                prop="roleName"
                label="角色名称"
                width="300">
            </el-table-column>
            <el-table-column
                prop="roleDesc"
                label="角色描述"
                width="300">
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
                    <el-button size="mini" type="success" @click="handleOpenDialog(scope.row)" icon="el-icon-check" plain></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 对话框 -->
         <el-dialog
            title="权限分配"
            :visible.sync="dialogVisible">
            <!-- 树
                    data 绑定到树上的数据[{}]
                    props 告诉树上的节点要展示的是哪个属性,子节点对应的属性是哪个
                 -->
                <el-tree
                    ref="tree"
                    default-expand-all
                    show-checkbox
                    node-key="id"
                    :default-checked-keys="checkedKeys"
                    :data="data"
                    :props="defaultProps">
                </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSetRights">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      // 控制对话框的显示与隐藏
      dialogVisible: false,
      data: [],
      defaultProps: {
        // 树上的节点绑定对象的属性
        label: 'authName',
        // 树上的子节点绑定的属性
        children: 'children'
      },
      checkedKeys: [],
      // 记录当前角色的id
      currentRoleId: -1
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const response = await this.$http.get('roles');
      const {meta: {msg, status}} = response.data;
      if (status === 200) {
        // 成功
        this.tableData = response.data.data;
      } else {
        // 失败
        this.$message.error(msg);
      }
    },
    // 删除当前角色对应的权限
    async handleClose(role, rightId) {
      // role当前行对应的角色对象
      // righttId当前权限对应的id
      // alert(rightId);
      const response = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      const {meta: {msg, status}} = response.data;
      if (status === 200) {
        // 成功
        this.$message.success(msg);
        // 值重新加载当前角色的权限列表
        role.children = response.data.data;
      } else {
        // 失败
        this.$message.error(msg);
      }
    },
    // 点击分配权限,显示对话框
    async handleOpenDialog(role) {
      this.dialogVisible = true;
      // 获取所有权限tree
      const response = await this.$http.get('rights/tree');
      this.data = response.data.data;
      // 设置当前角色所拥有的权限被选中
      // 当前角色所用有的三级权限的id
      const arr = [];
      // 遍历一级权限
      role.children.forEach((level1) => {
        // 遍历二级权限
        level1.children.forEach((level2) => {
          level2.children.forEach((level3) => {
            arr.push(level3.id);
          });
        });
      });
      this.checkedKeys = arr;
      // 记录当前角色的id
      this.currentRoleId = role.id;
    },
    // 点击确定按钮,给当前角色设置权限
    async handleSetRights() {
      // 获取树上选中和半选节点的id
      const arr1 = this.$refs.tree.getCheckedKeys();
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      const arr = [...arr1, ...arr2];
      const rids = arr.join(',');
      const response = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: rids
      });
      const {meta: {msg, status}} = response.data;
      if (status === 200) {
        this.$message.success(msg);
        this.dialogVisible = false;
        this.loadData();
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
</style>
