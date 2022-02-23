<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" style="margin: 0 auto;width: 95%;height: 45px">
    <el-tab-pane label="小时榜" name="first"></el-tab-pane>
    <el-tab-pane label="日榜" name="second"></el-tab-pane>
    <el-tab-pane label="周榜" name="third"></el-tab-pane>
    <el-tab-pane label="月榜" name="fourth"></el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "HeaderTabs",
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {

    }
  }
}
</script>

<style scoped>

</style>
