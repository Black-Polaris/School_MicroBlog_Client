<template>
  <div class="infinite-list-wrapper">
    <div
        class="list"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled">
      <!--        微博卡片-->
      <el-card shadow="hover" style=" margin-bottom: 10px" v-for="blog in blogs" class="list-item" >
        <!--            微博内容-->
        <el-row type="flex" >
          <el-col :span="22">
            <div style="margin-left: 10px">
              <h4>
                <router-link :to="{name: 'BlogDetail', params: {blogId: blog.id}}">
                  {{ blog.id }}
                </router-link>
              </h4>
              <p>{{ blog.content}}</p>
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
      blogs: [],
      currentPage: 1,
      total: 50,
      sum: 0,
      loading: false,
    }
  },
  computed: {
    noMore () {
      return this.sum > this.total;
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    load () {
      this.loading = true
      setTimeout(() => {
        const _this = this
        const currentPage = _this.currentPage
        console.log("-----------*" + _this.blogs)
        _this.$axios.get("/blogs?currentPage=" + currentPage)
            .then(res => {

              _this.blogs = _this.blogs.concat(res.data.data.records)
              // _this.blogs = res.data.data.records
              _this.currentPage = res.data.data.current + 1
              _this.total = res.data.data.total
              _this.sum += res.data.data.size
              console.log("*********" + _this.blogs)
            })
        this.loading = false
      }, 500)
    }
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
