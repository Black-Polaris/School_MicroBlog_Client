<template>
  <div>
    <div class="infinite-list-wrapper">
      <div
          class="list"
          v-infinite-scroll="load"
          infinite-scroll-disabled="disabled">
        <!--        微博卡片-->
        <el-card shadow="hover" style=" margin-bottom: 10px" v-for="blog in blogs" class="list-item" >
          <el-row :gutter="10">
            <el-col :span="2">
              <div>
                <el-avatar :src="avatarURL + blog.user.avatar.avatarUrl"></el-avatar>
              </div>
            </el-col>
            <el-col :span="4"><div style="font-weight: bold; text-align: left; margin-left: 5px;">{{ blog.user.nickname }}</div></el-col>
            <el-col :span="4" :offset="14"><div style="font-size: 10px" dataformatas="yyyy-MM-dd HH:mm:ss">{{ blog.createDate }}</div></el-col>
          </el-row>
          <!--            微博内容-->
          <el-row type="flex" >
            <el-col :span="2"><div></div></el-col>
            <el-col :span="22">
              <p style="margin-left: 10px;text-align: left;font-family: 'Microsoft YaHei'">{{ blog.content}}</p>
            </el-col>
          </el-row>

          <!--            九宫格图片-->
          <div style="margin: 5px">
            <el-row  type="flex" >
              <el-col :span="2"></el-col>
              <el-col :span="21">
                <div>
                  <el-row style="height: 100px;margin: 5px"  type="flex" v-for="i in ((blog.pictures.length)%3 == 0 ? (blog.pictures.length)/3 : (blog.pictures.length)/3 + 1) ">
                    <el-col style="width: 100px;margin: 5px" :span="7" v-for="j in ((blog.pictures.length - 3*(i-1)) > 3 ? 3 : (blog.pictures.length - 3*(i-1))) ">
                      <el-image
                          style="width: 100px; height: 100px; border-radius: 5px"
                          :src="pictureURL + blog.pictures[(i-1)*3+j-1]"
                          :preview-src-list="getPictureList(i,j,blog.pictures)">
                      </el-image>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>

          <!--            转发、评论、点赞功能-->
          <div style="margin-top: 15px">
            <el-row type="flex">
              <el-col :span="2"><div ></div></el-col>
              <el-col :span="21">
                <el-row  type="flex" justify="space-around">
                  <el-col :span="7"><div>
                    <el-badge :value="blog.relay.relaySize" class="item" style="width: 100%">
                      <el-button style="width: 100%" :type="blog.love.isRelay?'success':''">{{ blog.love.isRelay?'已转发':'转发' }}</el-button>
                    </el-badge>
                  </div></el-col>
                  <el-col :span="7"><div>
                    <el-badge :value="blog.comment" class="item" style="width: 100%">
                      <el-button style="width: 100%">评论</el-button>
                    </el-badge>
                  </div></el-col>
                  <el-col :span="7"><div>
                    <el-badge :value="blog.love.loveSize" class="item" style="width: 100%">
                      <el-button style="width: 100%" @click="doLike(blog)" :type="blog.love.isLove?'success':''"> {{ blog.love.isLove?'已点赞':'点赞' }} </el-button>
                    </el-badge>
                  </div></el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多了</p>
    </div>
  </div>
</template>

<script>


import {formatDate} from "_element-ui@2.15.6@element-ui/src/utils/date-util";

export default {
  name: "MyBlog",
  data () {
    return {
      avatarURL: this.$store.state.avatarURL,
      pictureURL: this.$store.state.pictureURL,
      blogs: [],
      currentPage: 1,
      total: 100,
      sum: -1,
      loading: false,

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
  methods: {
    load () {
      this.loading = true
      setTimeout(() => {
        const _this = this
        const currentPage = _this.currentPage
        console.log("-----------*" + _this.blogs)
        _this.$axios.get("/blog/myBlogs?currentPage=" + currentPage,  {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          if (res.data.data.length != 0) {
            _this.blogs = _this.blogs.concat(res.data.data)
          }
          // _this.blogs = res.data.data.records
          _this.currentPage = ++_this.currentPage
          _this.total = _this.blogs.length
          _this.sum = res.data.data.length
          console.log("*********"+_this.currentPage+"------" + _this.total +"----" + _this.sum)
        })
        this.loading = false
      }, 500)
    },
    // 预览点击的图片
    getPictureList(i, j, pictures) {
      const temp = []
      pictures.forEach(picture => {
        temp.push(this.pictureURL + picture)
      })
      return temp.slice((i-1)*3+j-1).concat(temp.slice(0,(i-1)*3+j-1))
    },
    // 点赞
    doLike(blog) {
      console.log(blog.id)
      blog.createDate = formatDate(blog.createDate,"yyyy-MM-dd HH:mm:ss")
      if (!blog.love.isLove) {
        this.$axios.post("/love/doLove", blog, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
              blog.love.loveSize += 1
              blog.love.isLove = true
            }
        )
      } else {
        this.$axios.post("/love/unLove", blog, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
              blog.love.loveSize -= 1
              blog.love.isLove = false
            }
        )
      }
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
