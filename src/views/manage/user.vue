<template>
   <div class="m-20">
      <div class="mb-15 lz-flex lz-space-between">
         <div>
            <el-button class="mr-15" @click="addUser">添加成员</el-button>
         </div>
         <!-- 搜索 -->
         <div>
            <el-input
               placeholder="请输入关键字搜索"
               prefix-icon="el-icon-search"
               style="width: 300px"
               @keyup.enter.native="handleChange"
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
         @sort-change="sortChange"
         @row-dblclick="handleClick"
         >
         <el-table-column
            fixed
            prop="user_id"
            label="ID"
            sortable="custom"
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
            sortable="custom"
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
            sortable="custom"
            width="120">
            <template slot-scope="scope">
               <span class="el-dropdown-link" v-if="scope.row.role==1">
                  超级管理员
               </span>
               <el-dropdown @command="handleCommand(scope.row,$event)" v-else>
                  <span class="el-dropdown-link cur-handle">
                  {{ scope.row.role==0 ? '普通用户' : "管理员" }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                     <el-dropdown-item  :command="0">普通用户</el-dropdown-item>
                     <el-dropdown-item  :command="2">管理员</el-dropdown-item>
                  </el-dropdown-menu>
               </el-dropdown>
            </template>
         </el-table-column>
         <el-table-column
            prop="create_time"
            label="注册时间"
            width="140">
            <template slot-scope="scope">
               <el-popover
                  placement="top-start"
                  title="位置信息"
                  width="250"
                  trigger="hover">
                  IP: {{scope.row.register_ip}} <br> 
                  位置：{{scope.row.reg_location || '--'}}
                  <span slot="reference">{{scope.row.create_time}}</span>
               </el-popover>
            </template>
         </el-table-column>

         <el-table-column
            prop="last_login_time"
            label="最后登录时间"
            width="140">
            <template slot-scope="scope">
               <el-popover
                  placement="top-start"
                  title="位置信息"
                  width="250"
                  trigger="hover">
                  IP: {{scope.row.last_login_ip}} <br> 
                  位置：{{scope.row.location || '--'}}
                  <span slot="reference">{{scope.row.last_login_time}}</span>
               </el-popover>
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
               <el-switch @change="setStatus(scope.row)" v-if="scope.row.user_id!=1" v-model="scope.row.status" :active-value="1" :inactive-value="0">
               </el-switch>
               <span v-else>--</span>
               </template>
         </el-table-column>
         <el-table-column
            fixed="right"
            label="操作"
            width="180">
            <template slot-scope="scope">
               <el-button @click="openDialogue(scope.row)" type="text" size="small"><span class="c-orange">会话列表</span></el-button>
               <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
               <el-button @click="editUser(scope.row)" type="text" size="small" v-if="scope.row.user_id>1">编辑</el-button>
               <el-button @click="editPass(scope.row)" type="text" size="small">改密</el-button>
               <!-- <el-button @click="delUser(scope.row)" type="text" size="small" v-if="scope.row.user_id>1"><span class="c-red">删除</span></el-button> -->
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
      <el-dialog
         :title="currentUser.realname+' 的会话管理'"
         :visible.sync="dialogueBox"
         :modal="true"
         width="80%"
         @close="dialogueBox=false"
         append-to-body
      >
         <dialogue :userInfo="currentUser" :key="componentKey"></dialogue>
      </el-dialog>
      <el-dialog
         :title="formTitle"
         :visible.sync="dialogVisible"
         :modal="true"
         width="500px"
         @close="dialogVisible=false"
         append-to-body
      >
      <el-form :model="detail" :rules="rules" ref="userinfo" label-width="100px">
              <el-form-item label="账号" prop="account">
                  <el-input placeholder="请输入邮箱或者手机号" v-model="detail.account"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" v-show="formType=='add'">
               <el-input v-model="detail.password" show-password  placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="realname">
                  <el-input placeholder="请输入用户名称" v-model="detail.realname"></el-input>
              </el-form-item>
              <el-form-item label="e-mail" prop="email">
                  <el-input placeholder="请输入邮箱地址" v-model="detail.email"></el-input>
              </el-form-item>
              <el-form-item label="专属客服" prop="cs_uid">
               <user-select :width="'180px'" :radio="true" v-model='detail.cs_uid'></user-select>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="detail.sex">
                     <el-radio :label="2" border>未知</el-radio>
                     <el-radio :label="1" border>男</el-radio>
                     <el-radio :label="0" border>女</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="角色" prop="role">
                  <el-radio-group v-model="detail.role">
                     <el-radio :label="0" border>普通用户</el-radio>
                     <el-radio :label="2" border>管理员</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="detail.status">
                     <el-radio :label="1" border>正常</el-radio>
                     <el-radio :label="0" border>禁用</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="好友上限" prop="friend_limit">
                <el-input-number class="ml-10" v-model="detail.friend_limit" :min="0" :max="1000"></el-input-number>
                <span class="ml-10 c-999 f-12">个，0表示不限制，-1表示禁止创建</span>
              </el-form-item>
              <el-form-item label="群聊上限" prop="group_limit">
                <el-input-number class="ml-10" v-model="detail.group_limit" :min="0" :max="1000"></el-input-number>
                <span class="ml-10 c-999 f-12">个，0表示不限制-1表示禁止创建</span>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
               <el-input type="textarea" :rows="2" v-model="detail.remark"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('userinfo')">保存</el-button>
              </el-form-item>
          </el-form>
         
      </el-dialog>
      <el-dialog
         title="修改密码"
         :visible.sync="dialogPass"
         :modal="true"
         width="400px"
         append-to-body
      >
      <el-form label-width="100px">
              <el-form-item label="新密码">
               <el-input v-model="password" show-password  placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label="重复密码">
               <el-input v-model="repass" show-password  placeholder="请输入重复输入密码"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="editPassword()">保存</el-button>
              </el-form-item>
          </el-form>
      </el-dialog>
   </div>
 </template>
 
 <script>
 import { mapState } from 'vuex';
 import userSelect from '@/components/userSelect/index';
 import dialogue from './components/dialogue';
   export default {
      components: {
         userSelect,
         dialogue
      },
      data() {
        return {
         componentKey:0,
         total: 0,
         params:{
             page:1,
             limit:20,
             keywords:'',
             order_field:'',
             order_type:1,
         },
         userList: [],
         formTitle:"添加成员",
         formType:"add",
         dialogVisible:false,
         dialogueBox:false,
         detail:{},
         originDetail:{
            realname:'',  
            password:'123456',
            email:'',
            sex:2,
            role:0,
            friend_limit:0,
            group_limit:0,
            remark:'',
            status:1,
         },
         rules:{
            account: [
               { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
            ],
            realname: [
               { required: true, message: '请输入用户名称', trigger: 'blur' },
               { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
            ],
            email: [
               { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ],
            password: [
               { required: true, message: '请输入密码', trigger: 'blur' },
               { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
            ],
         },
         dialogPass:false,
         password:'',
         repass:'',
         currentUser:{},
       }
     },
     computed: {
      ...mapState({
         globalConfig: state => state.globalConfig
      })
   },
     watch: {
      dialogVisible(New) {
         if (!New) {
            this.detail=this.originDetail;
         }
      }
     },
     mounted() {
         this.detail=this.originDetail;
         this.getUserList();
         let regauth=this.globalConfig.sysInfo.regauth ?? 0;
         let msg='请输入账号：4-32个字符';
         switch(parseInt(regauth)){
            case 1:
               msg='请输入正确的手机号';
               break;
            case 2:
               msg='请输入正确的邮箱';
               break;
            case 3:
               msg='请输入正确的手机号或者邮箱';
               break;
            default:
               msg='请输入正确的账号';
               break;
               
         }
         let req={ required: true, message: msg, trigger: 'blur' };
         this.rules.account.push(req)
         let email={ type: 'email', message: msg, trigger: 'blur', validator: this.validateContact };
         let mobile={ type: 'phone', message: msg, trigger: 'blur', validator: this.validateContact };
         if(regauth==1){
            this.rules.account.push(mobile)
         }else if(regauth==2){
            this.rules.account.push(email)
         }else if(regauth==3){
            this.rules.account.push(email)
            this.rules.account.push(mobile)
         }
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
      // 排序
      sortChange(column){
         this.params.order_field = column.prop;
         if(column.order==null){
            this.params.order_field = null;
         }
         this.params.order_type = column.order=='ascending'?1:2;
         this.getUserList();
      },
      handleClick(row) {
         this.$user(row.user_id,{isManage:true,editDataCallbak: data =>{
            this.editUser(data);
         }});
      },
      openDialogue(row) {
         this.currentUser=row;
         this.componentKey++;
         this.dialogueBox=true;
      },
      handleChange() {
         // 更换每页显示条数后，需要重新从第一页开始
        this.params.page = 1;
        this.getUserList();
      },
      // 添加成员
      addUser(){
         this.formTitle = "添加成员";
         this.formType = "add";
         this.dialogVisible = true;
      },
      // 修改成员
      editUser(item){
         let detail = item;
         this.formTitle = "修改成员";
         this.formType = "edit";
         this.dialogVisible = true;
         detail.password = 'rainagd';
         this.detail = detail;
      },
      validateContact(rule, value, callback) {
         if (!value) {
            callback();
         } else if (/^1[3456789]\d{9}$/.test(value) || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
            callback();
         } else {
            callback(new Error('请输入正确的手机号或邮箱'));
         }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.formType=='add'){
               this.$api.userApi.addUser(this.detail).then(res=>{
                if(res.code==0){
                  this.dialogVisible = false;
                  this.getUserList();
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                }
              })
            }else{
               let detail = JSON.parse(JSON.stringify(this.detail));
               delete detail.password;
               this.$api.userApi.editUser(detail).then(res=>{
                  if(res.code==0){
                     this.dialogVisible = false;
                     this.getUserList();
                     this.$message({
                        message: res.msg,
                        type: 'success'
                     });
                  }
               })
            }
              
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      editPass(item){
         this.currentUser = item;
         this.dialogPass = true;
      },
      // 修改密码
      editPassword(){
         if(this.password=='' || this.password.length<6 || this.password.length>16){
            this.$message({
               message: '请输入6-16个字符串的密码',
               type: 'warning'
            });
            return false;
         }
         if(this.password!=this.repass){
            this.$message({
               message: '两次密码不一致',
               type: 'warning'
            });
            return false;
         }
         let params = {
            user_id:this.currentUser.user_id,
            password:this.password
         }
         this.$api.userApi.editPassword(params).then(res=>{
            if(res.code==0){
               this.dialogPass = false;
               this.password = '';
               this.repass = '';
               this.$message({
                  message: res.msg,
                  type: 'success'
               });
            }
         })
      },
      // 设置状态
      setStatus(item){
         let params = {
            user_id:item.user_id,
            status:item.status
         }
         this.$api.userApi.setStatus(params).then(res=>{
            if(res.code==0){
               this.$message({
                  message: res.msg,
                  type: 'success'
               });
            }
         })
      },
      handleCommand(item,command) {
         let params = {
            user_id:item.user_id,
            role:command
         }
         this.$api.userApi.setRole(params).then(res=>{
            if(res.code==0){
               item.role = command;
               this.$message({
                  message: res.msg,
                  type: 'success'
               });
            }
         })
      },
      delUser(item){
         this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
         }).then(() => {
            let params = {
               user_id:item.user_id
            }
            this.$api.userApi.delUser(params).then(res=>{
               if(res.code==0){
                  this.$message({
                     message: res.msg,
                     type: 'success'
                  });
                  this.getUserList();
               }
            })
         }).catch(() => {
            this.$message({
               type: 'info',
               message: '已取消删除'
            });          
         });
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