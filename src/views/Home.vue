<template>
    <el-container>
        <el-header>
            <!-- <el-row>
                <el-col :span="12"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="12"><div class="grid-content bg-purple-light"></div></el-col>
            </el-row> -->
        </el-header>
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {

};
</script>

<style>
.el-container{
    height: 100%;
}
.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
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
}
</style>
