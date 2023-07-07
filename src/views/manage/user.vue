<template>
   <div class="m-20">
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
               <el-button slot="append" icon="el-icon-search" @click="handleChange"></el-button>
            </el-input>
         </div>
         
      </div>
      
      <el-table
      :data="userList"
      stripe
      style="width: 100%;border: solid 1px #e3e3e3;"
      :height="'calc(100vh - 200px)'"
      :header-cell-style="{'background-color':'#f5f7fa','color':'#909399'}"
      >
      <el-table-column
         fixed
         prop="user_id"
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
         <template slot-scope="scope">
            <span class="el-dropdown-link" v-if="scope.row.sex==0">女</span>
            <span class="el-dropdown-link" v-if="scope.row.sex==1">男</span>
            <span class="el-dropdown-link" v-if="scope.row.sex==2">未知</span>
         </template>
      </el-table-column>
      <el-table-column
         prop="role"
         label="角色"
         width="120">
         <template slot-scope="scope">
            <span class="el-dropdown-link" v-if="scope.row.role==1">
               超级管理员
            </span>
            <el-dropdown v-else>
            <span class="el-dropdown-link">
            {{ scope.row.role==0 ? '普通成员' : "管理员" }}<i class="el-icon-arrow-down el-icon--right"></i>
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
            <el-switch v-if="scope.row.user_id!=1" v-model="scope.row.status" :active-value="1" :inactive-value="0">
            </el-switch>
            <span v-else>--</span>
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
               @size-change="handleChange"
               @current-change="getUserList"
               :current-page.sync="params.page"
               :page-sizes="[20, 50 ,100 , 200, 300, 400,500]"
               :page-size.sync="params.limit"
               layout="total, sizes, prev, pager, next, jumper"
               :total="total">
         </el-pagination>
      </div>
   </div>
 </template>
 
 <script>
   export default {
     data() {
       return {
         total: 0,
         params:{
             page:1,
             limit:20,
             keywords:''
         },
         userList: [],
       }
     },
     mounted() {
      this.getUserList();
     },
     methods: {
      // 获取用户列表
      getUserList(){
         this.$api.userApi.getUserList(this.params).then(res=>{
            if(res.code == 0){
               this.userList = res.data;
               this.total = res.count;
               this.params.page = res.page;
            }
         })
      },
      handleClick(row) {
         this.$user(row.user_id,{isManage:true});
      },
      handleChange() {
         // 更换每页显示条数后，需要重新从第一页开始
        this.params.page = 1;
        this.getUserList();
      },
     }
   }
 </script>
 <style lang="scss" scoped>
 ::v-deep .table-header {
      background-color: #f5f5f5;
      color: #333;
   }
</style>