<template>
  <div>
    我的
    <div class="infinite-list-wrapper">
      <div
          class="list"
          v-infinite-scroll="load"
          infinite-scroll-disabled="disabled">
        <!--        微博卡片-->
        <el-card shadow="hover" style=" margin-bottom: 10px" v-for="blog in blogs" class="list-item" >
          <el-row :gutter="10">
            <el-col :span="2"><div class="grid-content bg-purple"><el-avatar icon="el-icon-user-solid"></el-avatar></div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple">{{ blog.userId }}</div></el-col>
            <el-col :span="4" :offset="14"><div class="grid-content bg-purple">{{ blog.updateDate }}</div></el-col>
          </el-row>
          <!--            微博内容-->
          <el-row type="flex" >
            <el-col :span="2"><div class="grid-content bg-purple"></div></el-col>
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

          <!--            九宫格图片-->
          <div>
            <el-row  type="flex" >
              <el-col :span="2"><div class="grid-content bg-purple"></div></el-col>
              <el-col :span="21" :offset="1">
                <div>
                  <el-row type="flex" v-for="i in srcList.length + 1 ">
                    <el-col :span="7" v-for="i in srcList.length + 1 ">
                      <el-image
                          style="width: 100px; height: 100px; border-radius: 5px"
                          :src="url"
                          :preview-src-list="srcList">
                      </el-image>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>

          <!--            转发、评论、点赞功能-->
          <el-row type="flex" >
            <el-col :span="2"><div class="grid-content bg-purple"></div></el-col>
            <el-col :span="22">
              <el-row  type="flex" justify="space-around">
                <el-col :span="6"><div class="grid-content bg-purple">
                  <el-badge :value="12" class="item">
                    <el-button size="small">转发</el-button>
                  </el-badge>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple-light">
                  <el-badge :value="12" class="item">
                    <el-button size="small">评论</el-button>
                  </el-badge>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                  <el-badge :value="12" class="item">
                    <el-button size="small">点赞</el-button>
                  </el-badge>
                </div></el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多了</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "MyBlog",
  data () {
    return {
      blogs: [],
      currentPage: 1,
      total: 100,
      sum: 0,
      loading: false,

      // 九宫格
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ]
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

  height: 810px;
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
