<template>
   <div class="m-20">
      <div class="mb-15 lz-flex lz-space-between">
         <div>
            <el-radio-group v-model="params.type" @input="handleChange()">
               <el-radio-button :label="item.value" v-for="(item,index) in typeList" :key="index">{{ item.name }}</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="params.is_group" class="ml-10" @input="handleChange()">
               <el-radio-button :label="-1" >全部</el-radio-button>
               <el-radio-button :label="1" >单聊</el-radio-button>
               <el-radio-button :label="2" >群聊</el-radio-button>
            </el-radio-group>
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
         :data="list"
         stripe
         style="width: 100%;border: solid 1px #e3e3e3;"
         :height="'calc(100vh - 200px)'"
         :header-cell-style="{'background-color':'#f5f7fa','color':'#909399'}"
         @sort-change="sortChange"
         @row-dblclick="handleClick"
         >
         <el-table-column
            fixed
            prop="msg_id"
            label="ID"
            sortable="custom"
            width="80">
         </el-table-column>
         <el-table-column
            prop="id"
            label="消息ID"
            width="280">
         </el-table-column>
         <el-table-column
            prop="type"
            label="类型"
            width="80">
            <template slot-scope="scope">
               <span class="el-dropdown-link">{{ getMsgType(scope.row.type) }}</span>
            </template>
         </el-table-column>
         <el-table-column
            prop="role"
            label="内容"
            min-width="300">
            <template slot-scope="scope">
               <div v-if="['text','location','contact'].includes(scope.row.type)" v-html="scope.row.content"></div>
               <div v-else-if="['image'].includes(scope.row.type)" @click="preview(scope.row)" class="cur-handle">
                  <el-image
                     style="height: 80px"
                     :src="scope.row.content"
                     fit="contain"></el-image>
               </div>
               <div v-else-if="['video','voice','file'].includes(scope.row.type)" @click="preview(scope.row)"><el-link type="primary" class="mr-10">预览</el-link><span>{{ scope.row.fileName ?? '未知'}}</span></div>
               <div v-else>暂不支持消息</div>
            </template>
         </el-table-column>
         <el-table-column
            prop="create_time"
            label="发送时间"
            sortable="custom"
            width="140">
         </el-table-column>

         <el-table-column
            prop="from_user"
            label="发送对象"
            width="120">
            <template slot-scope="scope">
               <el-link  type="primary" @click="openChat(scope.row.fromUser)">{{ scope.row.fromUser.realname }}</el-link>
            </template>
         </el-table-column>
         <el-table-column
            prop="to_user"
            label="接收对象"
            width="120">
            <template slot-scope="scope">
               <div><span v-if="scope.row.is_group">[群聊] </span> {{ scope.row.toUser && scope.row.toUser.name}}</div>
            </template>
         </el-table-column>   
         <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
               <el-popconfirm
               confirm-button-text='确定'
               cancel-button-text='取消'
               icon="el-icon-info"
               icon-color="red"
               @confirm="deal(scope.row,0)"
               title="确定屏蔽这条内容吗？"
               >
               <el-button slot="reference" type="text" size="small"><span class="c-orange">屏蔽</span></el-button>
               </el-popconfirm>
               
               <el-popconfirm
               class="ml-10"
               confirm-button-text='确定'
               cancel-button-text='取消'
               icon="el-icon-info"
               icon-color="red"
                @confirm="deal(scope.row,1)"
               title="确定删除这条内容吗？"
               >
               <el-button slot="reference" type="text" size="small"><span class="c-red">删除</span></el-button>
               </el-popconfirm>
            </template>
         </el-table-column>
      </el-table>
      <div class="mt-15">
         <el-pagination
               background
               @size-change="handleChange"
               @current-change="getList"
               :current-page.sync="params.page"
               :page-sizes="[20, 50 ,100 , 200, 300, 400,500]"
               :page-size.sync="params.limit"
               layout="total, sizes, prev, pager, next, jumper"
               :total="total">
         </el-pagination>
      </div>
      <el-dialog
         :title="currentUser.realname +' 的会话列表'"
         :visible.sync="dialogueBox"
         :modal="true"
         width="80%"
         @close="dialogueBox=false"
         append-to-body
      >
         <dialogue :userInfo="currentUser" :key="componentKey"></dialogue>
      </el-dialog>
   </div>
 </template>
 
 <script>
 import { mapState } from 'vuex';
 import userSelect from '@/components/userSelect/index';
 import dialogue from './components/dialogue';
 import * as utils from "@/utils/index";
   export default {
      components: {
         userSelect,
         dialogue
      },
      data() {
        return {
         total: 0,
         params:{
             type:'all',
             is_group:-1,
             page:1,
             limit:20,
             keywords:'',
             order_field:'',
             order_type:1,
         },
         componentKey:11,
         list: [],
         dialogueBox:false,
         currentUser:{},
         typeList:[
            {
               name:'全部',
               value:'all'
            },
            {
               name:'文本',
               value:'text'
            },
            {
               name:'图片',
               value:'image'
            },
            {
               name:'音频',
               value:'voice'
            },
            {
               name:'视频',
               value:'video'
            },
            {
               name:'文件',
               value:'file'
            },
         ]
       }
     },
     computed: {
      ...mapState({
         globalConfig: state => state.globalConfig
      })
   },
     watch: {
     },
     mounted() {
         this.getList();
     },
     methods: {
      // 获取用户列表
      getList(){
         this.$api.messageApi.getMessageList(this.params).then(res=>{
            if(res.code == 0){
               this.list = res.data;
               this.total = res.count;
               this.params.page = res.page;
            }
         })
      },
      getMsgType(type){
         return utils.getMsgType(type);
      },
      // 排序
      sortChange(column){
         this.params.order_field = column.prop;
         if(column.order==null){
            this.params.order_field = null;
         }
         this.params.order_type = column.order=='ascending'?1:2;
         this.getList();
      },
      handleClick(item){
      },
      openChat(item){
         this.componentKey++;
         this.currentUser=item;
         this.dialogueBox=true;
      },
      handleChange() {
         // 更换每页显示条数后，需要重新从第一页开始
        this.params.page = 1;
        this.getList();
      },
      deal(item,type){
         this.$api.messageApi.dealMsg({id:item.id,dealType:type}).then(res=>{
            if(res.code == 0){
               this.getList();
            }
         })
      },
      preview(item){
         this.$preview(item.preview);
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