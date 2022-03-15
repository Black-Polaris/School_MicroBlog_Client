<template>
  <div class="infinite-list-wrapper">
    <div class="list">
      <!--        微博卡片-->
      <el-card shadow="hover" style=" margin-bottom: 10px" v-for="hotSearch in hotSearchList" class="list-item" >
        <!--            微博内容-->
        <el-row type="flex" >
          <el-col>
            <div style="margin-left: 10px">
              <p style="text-align: left">
                <span class="el-icon-medal" style="color: red;font-style: italic">No.{{ ++rank }}:&nbsp</span>
                <router-link style="text-decoration: none;font-weight: bold;color: #333333;font-family: 'Microsoft YaHei'" :to="{name: 'SearchBlog', params: {searchWords: hotSearch.value}}">
                  {{ hotSearch.value }}
                </router-link>
                <span style="float: right;font-size: 12px">热度:{{ hotSearch.score}}</span>
              </p>
            </div>
          </el-col>
        </el-row>

      </el-card>
    </div>
    <p v-if="loading">加载中...</p>
    <p v-if="noMore">没有更多了</p>
  </div>
</template>

<script>
export default {
  name: "HotSearchList",
  data () {
    return {
      hotSearchList: [],
      total: 50,
      sum: -1,
      loading: false,
      rank : 0
    }
  },
  computed: {
    noMore () {
      return this.sum === 0
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  created() {
    this.loading = true
      const _this = this
      _this.$axios.get("/blog/hotSearch")
          .then(res => {
            _this.hotSearchList = res.data.data
            _this.sum = res.data.data.length
          })
      this.loading = false
  }

}
</script>

<style scoped>
.infinite-list-wrapper {
  width: 100%;
  height: 790px;
  overflow: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

.box {
  width: 100%;
  background-color: #fff;
}

.el-row {
  margin-bottom: 0px;
&:last-child {
   margin-bottom: 0;
 }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-row {
  text-align: center;
}


</style>
