<template>
   <div>
      <div class="mb-15 lz-flex lz-space-between">
         <div>
            <el-button class="mr-15">添加成员</el-button>
         </div>
         <!-- 搜索 -->
         <div>
            <el-input
               placeholder="请输入内容"
               prefix-icon="el-icon-search"
               style="width: 200px"
               @keyup.enter.native="search"
               v-model="params.keywords">
               <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
         </div>
         
      </div>
      
      <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      :height="'calc(100vh - 200px)'"
      :header-cell-style="{'background-color':'#f5f7fa','color':'#909399'}"
      >
      <el-table-column
         fixed
         prop="id"
         label="ID"
         width="150">
      </el-table-column>
      <el-table-column
         prop="realname"
         label="姓名"
         width="120">
      </el-table-column>
      <el-table-column
         prop="account"
         label="账号"
         width="120">
      </el-table-column>
      <el-table-column
         prop="sex"
         label="性别"
         width="120">
      </el-table-column>
      <el-table-column
         prop="role"
         label="角色"
         width="120">
         <template slot-scope="scope">
            <el-dropdown>
            <span class="el-dropdown-link">
               {{ scope.row.role }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
               <el-dropdown-item>普通成员</el-dropdown-item>
               <el-dropdown-item>管理员</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
         </template>
      </el-table-column>
      <el-table-column
         prop="remark"
         label="备注"
         min-width="300">
      </el-table-column>
      <el-table-column
         prop="status"
         label="状态"
         width="120">
         <template slot-scope="scope">
            <el-switch v-model="scope.row.status">
            </el-switch>
            </template>
      </el-table-column>
      <el-table-column
         fixed="right"
         label="操作"
         width="100">
         <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
         </template>
      </el-table-column>
      </el-table>
      <div class="mt-15">
         <el-pagination
               background
               @size-change="handleSizeChange"
               :current-page="params.page"
               :page-sizes="[100, 200, 300, 400]"
               :page-size="params.limit"
               layout="total, sizes, prev, pager, next, jumper"
               :total="400">
         </el-pagination>
      </div>
      
   </div>
 </template>
 
 <script>
   export default {
     methods: {
       handleClick(row) {
         console.log(row);
       },
       search(){

       },
       handleSizeChange(){

       }
     },
 
     data() {
       return {
         params:{
             page:1,
             limit:20,
             keywords:''
         },
         tableData: [{
           id: 1,
           realname: '王小虎',
           account: '18382420330',
           sex: '男',
           role: '管理员',
           remark: '上海市普陀区金沙江路 1518 弄',
           status: 1
         }]
       }
     }
   }
 </script>
 <style lang="scss" scoped>
 ::v-deep .table-header {
      background-color: #f5f5f5;
      color: #333;
   }
</style>