<template>
    <div class="pd-20 main-file-item">
        <fileItems :isAll="1"></fileItems>
    </div>
</template>

<script>
import fileItems from "@/components/message/files/items.vue";
  export default {
    components: {
        fileItems,
    },
    data() {
      return {
      }
    },
    methods: {
        openFolder(item){
            this.active = item.id
        }
    }
  }
</script>
<style>
.main-file-item{
    height:calc(100vh - 102px);
}
</style>