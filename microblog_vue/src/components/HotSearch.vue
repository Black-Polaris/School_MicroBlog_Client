<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>校园热搜</span>
      <el-button style="float: right; padding: 3px 0" type="text" class="el-icon-refresh">刷新</el-button>
    </div>
    <div v-for="o in 10" :key="o" class="text item">
      {{o + '列表内容 ' }}
    </div>
  </el-card>
</template>

<script>
export default {
  name: "HotSearch"
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  margin: 3px;
}
</style>
