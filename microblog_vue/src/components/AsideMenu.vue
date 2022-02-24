<template>
  <div class="box">
    <el-menu class="box"
        default-active="0"
        @select="handleSelect"
        active-text-color="orange">
      <el-menu-item index = "0">
        <i class="el-icon-medal"></i>
        <span slot="title">热门微博</span>
      </el-menu-item>
      <el-menu-item index = "1">
        <i class="el-icon-timer"></i>
        <span slot="title">最新微博</span>
      </el-menu-item>
      <el-menu-item index = "2">
        <i class="el-icon-user"></i>
        <span slot="title">个人微博</span>
      </el-menu-item>
      <el-menu-item index = "3">
        <i class="el-icon-search"></i>
        <span slot="title">热搜榜单</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "AsideMenu",
  data(){
    return{
      typeId:''
    }
  },
  methods:{
    handleSelect(key){
      this.typeId = key
      this.$emit('indexSelect')
    }
  }
}
</script>

<style scoped>
.box {
  height: 850px;
}
</style>
