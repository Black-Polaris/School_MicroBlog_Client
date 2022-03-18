<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>校园热搜</span>
      <el-button style="float: right; padding: 3px 0" type="text" class="el-icon-refresh" @click="refresh">换一批</el-button>
    </div>
    <div v-for="randomHotSearch in randomHotSearchSet" class="text item">
      <p style="text-align: left;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;">
        <router-link style="text-decoration: none;font-weight: bold;color: #333333;font-family: 'Microsoft YaHei'" :to="{name: 'SearchBlog', params: {searchWords: randomHotSearch}}">
          {{randomHotSearch}}
        </router-link>
      </p>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "HotSearch",
  data() {
    return {
      randomHotSearchSet: [],
      num: 1
    }
  },

  created() {
    this.$axios.get("/blog/randomHotSearch")
        .then(res => {
          this.randomHotSearchSet = res.data.data
        })
  },

  methods: {
    refresh() {
      this.$axios.get("/blog/randomHotSearch")
          .then(res => {
            this.randomHotSearchSet = res.data.data
          })
    }
  }

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
