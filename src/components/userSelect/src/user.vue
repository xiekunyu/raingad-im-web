<template>
  <div class="xh-user">
    <div v-if="headerShow" class="xh-user__hd">
      员工
    </div>
    <div class="xh-user__bd">
      <el-input v-model="searchInput" :disabled="disabled" placeholder="搜索成员" size="small" prefix-icon="el-icon-search"
        class="search-input" @input="inputValue" />
      <div class="search-lists" ref="searchLists" id="resultScroll" v-infinite-scroll="handleScroll"
        infinite-scroll-distance='700px'>
        <el-checkbox :indeterminate="isIndeterminate" :disabled="radio || disabled" v-model="checkAll" class="all-check"
          @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group ref="checkboxGroup" v-model="dataValue" :max="max" :disabled="disabled"
          @change="checkboxChange">
          <el-checkbox v-for="(item, i) in options" v-show="!item.isHide" :key="i" :label="item[props.value]"
            class="colleagues-list">
            <avatarList :avatarSize='24' :avatarMessageIsShow='false' class="logo-center mr-10"
              :class="item.status==0 && 'is-grays'" :avatarMessage="{avatarUrl:item.avatar}"></avatarList>
            <span>{{ item[props.label] }}</span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class=" xh-user__ft">
      <span class="select-info">已选择<span class="select-info--num">{{ value ? value.length : 0 }}</span>项</span>
      <el-button type="text" @click="clearAll">清空</el-button>
    </div>
  </div>
</template>
<script type="text/javascript">
import { valueEquals } from 'element-ui/lib/utils/util'
import { deepClone } from '@/utils'
import avatarList from '@/components/avatar/index'

export default {
  name: 'WkUser', // 新建 user
  components: { avatarList },
  props: {
    radio: Boolean,
    headerShow: {
      type: Boolean,
      default: true
    },
    // isHide 可不显示 但数据源里包含
    options: Array,
    value: Array,
    // 取值字段
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id',
          label: 'realname'
        }
      }
    },
    max: Number,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataValue: [],
      searchInput: '',
      checkAll: false,
      isIndeterminate: false,
      page: 1
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   let that = this;
    //   document
    //     .getElementById("resultScroll")
    //     .addEventListener("scroll", that.handleScroll, true);
    // })

  },
  computed: {
    // showOptions () {
    //   return this.options.filter(item => {
    //     return PinyinMatch.match(item[this.props.label], this.searchInput)
    //   })
    // }
  },
  watch: {
    value () {
      if (this.options && !this.radio) {
        const optionsLength = this.options.filter(item => !item.isHide).length
        if (this.value.length == optionsLength && (this.value.length > 0 || optionsLength > 0)) {
          this.checkAll = true
        } else {
          this.checkAll = false
        }

        this.isIndeterminate = !!(!this.checkAll && this.value.length)
      }

      if (!valueEquals(this.value, this.dataValue)) {
        this.dataValue = deepClone(this.value)
      }
    }
  },
  created () {
    this.dataValue = deepClone(this.value || [])
  },
  methods: {
    inputValue () {
      this.$refs.searchLists.scrollTop = 0
      this.page = 1
      this.$emit('getData', this.searchInput)
    },
    handleScroll () {
      // 获取距离底部距离
      // let scrollBottom =
      //   this.$refs.searchLists.scrollHeight -
      //   this.$refs.searchLists.scrollTop -
      //   this.$refs.searchLists.clientHeight;
      this.page = this.page + 1
      this.$emit('getData', this.searchInput, this.page)
      //自行定义
    },
    /**
     * 勾选
     */
    checkboxChange (val) {
      if (this.radio) {
        this.$emit('input', val.length ? [val[val.length - 1]] : [])

        // 单选直接关闭窗口
        this.$emit('close')
      } else {
        this.$emit('input', val)
      }
      this.$emit('change', val)
    },

    /**
     * 全部勾选
     */
    handleCheckAllChange (val) {
      if (val) {
        const ids = []
        this.options.forEach(item => {
          if (!item.isHide) {
            ids.push(item[this.props.value])
          }
        })
        this.$emit('input', ids)
      } else {
        this.$emit('input', [])
      }
    },

    /**
     * 清空全部
     */
    clearAll () {
      this.$emit('input', [])
    }
  }
}
</script>
<style lang="scss" scoped>
.logo-center {
  display: inline-block;
}
/* 选择员工 */
.user-img {
  margin-right: 8px;
  vertical-align: middle;
}
.search-lists {
  padding: 5px 0;
  height: 200px;
  overflow: auto;
}
.colleagues-list {
  padding: 5px 0;
  display: block;
  margin-left: 0;
  display: flex !important;
  align-items: center !important;
  align-content: center;
}

.xh-user {
  color: #333;
  font-size: 12px;
  &__hd {
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #c2c2c2;
  }

  &__bd {
    padding: 10px 12px;
  }

  &__ft {
    padding: 5px 12px;
    background: #f7f8fa;
    border-top: 1px solid #c2c2c2;
    .el-button {
      font-size: 12px;
    }
  }
}

// 选择信息
.select-info {
  display: inline-block;
  width: calc(100% - 30px);

  &--num {
    color: #175CFF;
  }
}

// check样式
.el-checkbox-group {
  overflow-x: hidden;
}

.el-checkbox {
  ::v-deep .el-checkbox__label {
    color: #333;
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
}

.all-check {
  padding: 5px 0;
  display: flex;
  align-items: center;
}

.search-input {
  ::v-deep .el-input__inner {
    background-color: #f4f4f4;
    border: none;
  }
}
</style>
