<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default {
    provide() {
    return {
      reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function (){
          this.isRouterAlive = true
        })
      }
    }
  }
</script>

<style>
  #app {
    max-width: 1200px;
    margin: 0 auto;
  }
  .el-popover{
    height:200px;
    width:400px;
    overflow: scroll;
    overflow-x:auto;
  }

</style>
