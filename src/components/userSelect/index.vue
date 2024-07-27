<template>
  <div v-elclickoutside="handleClose" ref="reference"
    :class="[disabled ? 'is_disabled' : 'is_valid', { 'is_focus': visible }]"
    :style="{ height: `${height}px`,width:width }" wrap="wrap" class="wk-user-select xh-form-border"
    @click="containerClick">
    <div ref="tags" class="el-select__tags">
      <span v-for="(item, index) in showSelects" :key="index" :class="{'is-hide': item.isHide}"
        class="user-item text-one-line">{{ item[props.label] }}
        <i v-if="!item.disabled" class="delete-icon el-icon-close" @click.stop="deleteuser(item, index)" />
      </span>
    </div>
    <i v-if="selects.length > max && max > 0" class="el-icon-more" />
    <i :class="['el-icon-arrow-up', { 'is-reverse' : visible}]" />
    <div v-if="selects.length == 0" class="user-placeholder text-one-line">{{ placeholder }}</div>

    <transition name="el-zoom-in-top" @before-enter="handleMenuEnter" @after-leave="doDestroy">
      <wk-select-dropdown v-show="visible && !disabled" ref="popper" :append-to-body="popperAppendToBody">
        <el-scrollbar ref="scrollbar" tag="div">
          <wk-user v-loading="loading" v-model="dataValue" :disabled="disabled" :options="optionsList" :props="props"
            :radio="radio" :max="limit" @change="wkUserChange" @close="visible = false" @getData='requestUserList'
            :page='page' />
        </el-scrollbar>
      </wk-select-dropdown>
    </transition>
  </div>
</template>

<script>

import WkSelectDropdown from './src/SelectDropdown.vue'
import WkUser from './src/user.vue'

import Emitter from 'element-ui/lib/mixins/emitter'
import { valueEquals } from 'element-ui/lib/utils/util'
import { deepClone,isEmpty } from '@/utils'

export default {
  name: 'WkUserSelect',

  components: {
    WkSelectDropdown,
    WkUser
  },

  mixins: [Emitter],

  props: {
    defalutValue: {
      type: [Object, Array, String, Number],
    },
    width: {
      type: String,
      default: '180px'
    },
    radio: Boolean,
    // 展示限制 0 标示展示全部
    max: {
      type: Number,
      default: 2
    },
    // 取值字段 如果继续新增 改为 props 方案
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id',
          label: 'realname'
        }
      }
    },
    // 选择限制
    limit: Number,
    placeholder: {
      type: String,
      default () {
        return '请选择'
      }
    },
    // eslint-disable-next-line vue/require-prop-types
    value: {
      // required: true
    },
    // 自定义请求和 参数
    request: Function,
    params: Object,
    options: Array,
    label: String,
    disabled: {
      type: Boolean,
      default: false
    },
    popperAppendToBody: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      page: 0,
      visible: false,
      dataValue: [], // 校准传入值
      loading: false,
      height: 32,

      optionsList: []
    }
  },

  computed: {
    // 实际展示的数据
    showSelects () {
      if (this.max && this.max > 0 && this.selects && this.selects.length > this.max) {
        return this.selects.slice(0, this.max)
      }
      return this.selects
    },
    // 选择的数据
    selects () {
      if (!this.optionsList.length || !this.dataValue.length) {
        return []
      }
      let datas = this.optionsList.filter((item) => {
        return this.dataValue.includes(item[this.props.value])
      })
      if (datas.length !== this.dataValue.length && this.dataValue && this.defalutValue != undefined) {
        let newDatas = Array.isArray(this.defalutValue) ? this.defalutValue : [Number(this.defalutValue)]
        newDatas = newDatas.filter((item) => !datas.some((ele) => ele.id === item.id));
        newDatas = [...newDatas, ...datas]
        newDatas = newDatas.filter((item) => this.dataValue.includes(item.id))
        return newDatas
      } else {
        return datas
      }
    }
  },

  watch: {
    visible (val) {
      if (!val) {
        this.broadcast('WkSelectDropdown', 'destroyPopper')
      } else {
        this.broadcast('WkSelectDropdown', 'updatePopper')
      }
      this.$emit('visible-change', val)
    },

    value (New, old) {
      this.verifyValue()
    },

    options: {
      handler () {
        this.verifyOptions()
      },
      immediate: true
    },

    /**
     * 更新值
     */
    dataValue (New) {
      for (let i = 0; i < this.dataValue.length; i++) {
        this.dataValue[i] = parseInt(this.dataValue[i], 10); // 第二个参数10表示十进制
      }
      if (this.radio) {
        this.$emit('input', this.dataValue && this.dataValue.length ? this.dataValue[0] : '')
      } else {
        this.$emit('input', this.dataValue)
      }

    },

    showSelects: {
      handler () {
        this.resetHeight()
      },
      immediate: true
    }
  },

  created () {
    this.verifyValue()
  },

  methods: {
    resetHeight () {
      const tags = this.$refs.tags

      if (tags) {
        this.$nextTick(() => {
          this.height = tags.clientHeight > 32 ? tags.clientHeight + 6 : 32
        })
      } else {
        this.height = 32
      }
    },

    /**
     * 处理值逻辑
     */
    verifyValue () {
     
      // 多选的默认值 校准为数组  单选校准为number
      if (!this.radio && !Array.isArray(this.value)) {
        this.$emit('input', [])
      }
      if (this.radio) {
        if (this.value !== this.dataValue) {
          if (!isEmpty(this.value)) {
            if (Array.isArray(this.value)) {
              this.dataValue = this.value.map(i => i[this.props.value])

            } else if (typeof (parseInt(this.value)) === 'number') {
              this.dataValue = [this.value]
            } else {
              this.dataValue = [this.value.id]
            }
          } else {
            this.dataValue = []
          }
        }
      } else {
        if (!valueEquals(this.value, this.dataValue)) {
          if (this.value && this.value.length) {
            const firstItem = this.value[0]
            if (firstItem[this.props.value]) {
              this.dataValue = this.value.map(item => item[this.props.value])
            } else {
              this.dataValue = deepClone(this.value)
            }
          } else {
            this.dataValue = []
          }
        }
      }
    },

    /**
     * 处理options
     */
    verifyOptions () {
      if (!this.options) {
        this.requestUserList()
      } else {
        this.optionsList = this.options
      }
    },

    /**
     * 获取请求
     */
    requestUserList (serch, page = 1) {
      this.loading = true
      let request = this.$api.imApi.userList
      if (this.request) {
        request = this.request
      } else if (this.props.request) {
        request = this.props.request
      }
      request(({ page: page, limit: 20, keywords: serch }))
        .then(res => {
          if (res.data.hasOwnProperty('list')) {
            res.data = res.data.list
          }
          if (serch && page == 1) {
            this.optionsList = []
          }
          res.data.forEach((i, k) => {
            let flag = this.optionsList.map(v => v.id).includes(i.id)
            if (!flag) this.optionsList.push(i)
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    handleClose () {
      this.visible = false
    },
    handleMenuEnter () {
      // 处理聚焦到具体位置
    },

    doDestroy () {
      this.$refs.popper && this.$refs.popper.doDestroy()
    },

    /**
     * 删除
     */
    deleteuser (item) {
      if (!item.disabled && !this.disabled) {
        for (let index = 0; index < this.dataValue.length; index++) {
          const id = this.dataValue[index]
          if (id == item[this.props.value]) {
            this.dataValue.splice(index, 1)
            break
          }
        }
        this.$emit('change', this.dataValue, this.selects)

      }
    },

    /**
     * 聚焦动作
     */
    focusClick () {
      this.$emit('focus')
    },

    /**
     * chang 事件
     */
    wkUserChange () {
      this.$nextTick(() => {
        if (this.radio) {
          this.dispatch('ElFormItem', 'el.form.change', this.dataValue && this.dataValue.length ? this.dataValue[0] : '')
        } else {
          this.dispatch('ElFormItem', 'el.form.change', this.dataValue)
        }
      })
      this.$emit('change', this.dataValue, this.selects)
    },
      

    containerClick () {
      if (!this.disabled) {
        this.visible = true
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.wk-user-select {
  box-sizing: border-box;
  height: 32px;
  // display: inline-block;
  position: relative;
  border-radius: 4px;
  font-size: 13px;
  background-color: white;
  border: 1px solid #e6e6e6;
  color: #333333;
  padding: 0 20px 0 5px;
  cursor: pointer;

  .user-item {
    padding: 3px 15px 3px 5px;
    background-color: #f3f7ff;
    border-radius: 4px;
    margin: 3px;
    max-width: 80px;
    position: relative;

    &.is-hide {
      background-color: #f2f2f2;
      color: #999;
    }
  }
  .user-placeholder {
    color: #ddd;
    line-height: 32px;
    cursor: pointer;
  }
  .delete-icon {
    color: #999;
    cursor: pointer;
    position: absolute;
    top: 6px;
    right: 2px;

    &:hover {
      color: #175CFF;
    }
  }
  &:hover {
    border-color: #c0c4cc;
  }
}

.wk-user-select.is_disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  cursor: not-allowed;
  .user-item {
    background-color: #f0f4f8ea;
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .delete-icon {
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .user-placeholder {
    color: #c0c4cc;
    cursor: not-allowed;
  }
}

.wk-user-select.is_valid:hover {
  border-color: #c0c4cc;
}

.wk-user-select.is_focus {
  border-color: #175CFF !important;
}

.el-select__tags {
  padding-right: 30px;
}

.el-icon-more {
  position: absolute;
  top: 3px;
  right: 20px;
  padding: 6px 10px;
  font-size: 12px;
  background-color: #f3f7ff;
  color: #666;
  border-radius: 4px;
  &:hover {
    background-color: #175CFF;
    color: white;
  }
}

.el-icon-arrow-up {
  position: absolute;
  top: calc(50% - 7px);
  right: 5px;
  transition: transform 0.3s;
  color: #c0c4cc;
  font-size: 14px;
  transition: transform 0.3s;
  transform: rotate(180deg);
  cursor: pointer;
}
.el-icon-arrow-up.is-reverse {
  transform: rotate(0deg);
}
</style>
