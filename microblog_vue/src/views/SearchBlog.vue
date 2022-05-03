<template>
  <el-container class="box">
    <!--    header部分-->
    <el-header><Header></Header></el-header>
    <!--    <BlogEdit></BlogEdit>-->
    <el-container>
      <el-main style="padding: 3px;margin: 3px;border-radius: 5px">
        <!--        main部分-->
        <el-row>
          <!--        微博列表-->
          <el-col :span="18" class="infinite-list-wrapper">
            <div class="infinite-list-wrapper">
<!--              查找的用戶-->
              <div class="user-list"  v-show="users.length != 0" style="padding: 3px">
                <el-row type="flex" v-for="i in (users.length%2 == 0 ? Math.floor(users.length/2) : Math.floor(users.length/2) +1)">
                  <el-col style="width: 49%;margin: 5px" v-for="j in (users.length - 2*(i-1)) > 2 ? 2 : (users.length -2*(i-1))">
                    <el-card shadow="hover" style="margin: 4px; margin-bottom: -3px;">
                      <el-row :gutter="21">
                        <el-col :span="2">
                          <div>
                            <el-avatar :src="avatarURL + users[(i-1)*2+j-1].avatar.avatarUrl"></el-avatar>
                          </div>
                        </el-col>
                        <el-col :span="19" :offset="1">
                          <el-row :span="6">
                            <div style="font-weight: bold; text-align: left; margin-left: 5px;">
                              <router-link style="text-decoration: none;font-weight: bold;color: #333333;font-family: 'Microsoft YaHei'" :to="{name: 'UserBlogs', params: { userId: users[(i-1)*2+j-1].id }}">
                                {{ users[(i-1)*2+j-1].nickname }}
                              </router-link>
                            </div>
                          </el-row>
                          <el-row :span="6"><div style="font-size: 10px; text-align: left; margin-left: 5px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap">简介：{{ users[(i-1)*2+j-1].description }}</div></el-row>
                        </el-col>
                      </el-row>
                    </el-card>
                  </el-col>
                </el-row>
              </div>

              <div
                  class="list"
                  v-infinite-scroll="load"
                  infinite-scroll-disabled="disabled">
                <!--        微博卡片-->
                <el-card shadow="hover" style=" margin-bottom: 10px" v-for="blog in blogs" class="list-item" v-show="blog.status != -1">
                  <!--          原创状态微博-->
                  <div v-show="blog.status == 1">
                    <el-row :gutter="10">
                      <el-col :span="2">
                        <div>
                          <el-avatar :src="avatarURL + blog.user.avatar.avatarUrl"></el-avatar>
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div style="font-weight: bold; text-align: left; margin-left: 5px;">
                          <router-link style="text-decoration: none;font-weight: bold;color: #333333;font-family: 'Microsoft YaHei'" :to="{name: 'UserBlogs', params: {userId: blog.user.id}}">
                            {{ blog.user.nickname }}
                          </router-link>
                        </div>
                      </el-col>
                      <el-col :span="4" :offset="11"><div style="font-size: 10px;" dataformatas="yyyy-MM-dd HH:mm:ss">{{ blog.createDate }}</div></el-col>
                      <el-col :span="3">
                        <el-button v-show="blog.userId != userId" :class="blog.hadFollow?'el-icon-star-on':'el-icon-star-off'" :type="blog.hadFollow?'success':'primary'" round @click="doFollow(blog)">
                          {{ blog.hadFollow?'已关注':'关注' }}
                        </el-button>
                      </el-col>
                    </el-row>
                    <!--            微博内容-->
                    <el-row type="flex" >
                      <el-col :span="2"><div></div></el-col>
                      <el-col :span="22">
                        <p style="margin-left: 10px;text-align: left;font-family: 'Microsoft YaHei'" v-html="blog.content"></p>
                      </el-col>
                    </el-row>

                    <!--            九宫格图片-->
                    <div style="margin: 5px">
                      <el-row  type="flex" >
                        <el-col :span="2"></el-col>
                        <el-col :span="21">
                          <div>
                            <el-row style="height: 100px;margin: 5px"  type="flex" v-for="i in ((blog.pictures.length)%3 == 0 ? Math.floor((blog.pictures.length)/3) : Math.floor((blog.pictures.length)/3) + 1) ">
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
                                <el-button style="width: 100%" @click="doRelay(blog)" :type="blog.relay.isRelay?'success':''">{{ blog.relay.isRelay?'已转发':'转发' }}</el-button>
                              </el-badge>
                            </div></el-col>
                            <el-col :span="7"><div>
                              <el-badge :value="blog.comment" class="item" style="width: 100%">
                                <el-button style="width: 100%" @click="doComment(blog)">评论</el-button>
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
                  </div>
                  <!--          转发状态微博-->
                  <div v-show="blog.status == 2">
                    <el-row :gutter="10">
                      <el-col :span="2">
                        <div>
                          <el-avatar :src="avatarURL + blog.user.avatar.avatarUrl"></el-avatar>
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div style="font-weight: bold; text-align: left; margin-left: 5px;">
                          <router-link style="text-decoration: none;font-weight: bold;color: #333333;font-family: 'Microsoft YaHei'" :to="{name: 'UserBlogs', params: {userId: blog.user.id}}">
                            {{ blog.user.nickname }}
                          </router-link>
                        </div>
                      </el-col>
                      <el-col :span="4" :offset="11"><div style="font-size: 10px;" dataformatas="yyyy-MM-dd HH:mm:ss">{{ blog.createDate }}</div></el-col>
                      <el-col :span="3">
                        <el-button v-show="blog.userId != userId" :class="blog.hadFollow?'el-icon-star-on':'el-icon-star-off'" :type="blog.hadFollow?'success':'primary'" round @click="doFollow(blog)">
                          {{ blog.hadFollow?'已关注':'关注' }}
                        </el-button>
                      </el-col>
                    </el-row>
                    <!--            微博内容-->
                    <div>
                      <el-row type="flex" >
                        <el-col :span="2"><div></div></el-col>
                        <el-col :span="22">
                          <p style="margin-left: 10px;text-align: left;font-weight: bold">转发微博</p>
                        </el-col>
                      </el-row>

                      <el-row type="flex" >
                        <el-col :span="2"><div></div></el-col>
                        <el-col :span="22">
                          <!--              转发微博内容-->
                          <div style="border-radius: 5px;background-color: #f2f2f2;padding: 5px">
                            <el-row :gutter="10">
                              <el-col :span="2">
                                <div>
                                  <el-avatar :src="blog.fromBlog == null ? null : avatarURL + blog.fromBlog.user.avatar.avatarUrl"></el-avatar>
                                </div>
                              </el-col>
                              <el-col :span="4"><div style="font-weight: bold; text-align: left; margin-left: 5px;">{{ blog.fromBlog == null ? null : blog.fromBlog.user.nickname }}</div></el-col>
                              <el-col :span="4" :offset="14"><div style="font-size: 10px" dataformatas="yyyy-MM-dd HH:mm:ss">{{ blog.fromBlog == null ? null : blog.fromBlog.createDate }}</div></el-col>
                            </el-row>

                            <el-row type="flex" >
                              <el-col :span="2"><div></div></el-col>
                              <el-col :span="22">
                                <p style="margin-left: 10px;text-align: left;font-family: 'Microsoft YaHei'" v-html="blog.fromBlog == null? null :blog.fromBlog.content"></p>
                              </el-col>
                            </el-row>
                            <!--            九宫格图片-->
                            <div style="margin: 5px">
                              <el-row  type="flex" >
                                <el-col :span="2"></el-col>
                                <el-col :span="21">
                                  <div>
                                    <el-row style="height: 100px;margin: 5px"  type="flex" v-for="i in ((blog.fromBlog == null? 0 : blog.fromBlog.pictures.length)%3 == 0 ? Math.floor((blog.fromBlog == null? 0 : blog.fromBlog.pictures.length)/3) : Math.floor((blog.fromBlog == null? 0 : blog.fromBlog.pictures.length)/3) + 1) ">
                                      <el-col style="width: 100px;margin: 5px" :span="7" v-for="j in ((blog.fromBlog == null? 0 : blog.fromBlog.pictures.length - 3*(i-1)) > 3 ? 3 : (blog.fromBlog == null? 0 : blog.fromBlog.pictures.length - 3*(i-1))) ">
                                        <el-image
                                            style="width: 100px; height: 100px; border-radius: 5px"
                                            :src="pictureURL + (blog.fromBlog == null? blog.pictures : blog.fromBlog.pictures[(i-1)*3+j-1])"
                                            :preview-src-list="getPictureList(i,j,blog.fromBlog == null? blog.pictures :blog.fromBlog.pictures)">
                                        </el-image>
                                      </el-col>
                                    </el-row>
                                  </div>
                                </el-col>
                              </el-row>
                            </div>
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
                                <el-button style="width: 100%" @click="doRelay(blog)"  :type="blog.love.isRelay?'success':''">{{ blog.love.isRelay?'已转发':'转发' }}</el-button>
                              </el-badge>
                            </div></el-col>
                            <el-col :span="7"><div>
                              <el-badge :value="blog.comment" class="item" style="width: 100%">
                                <el-button style="width: 100%" @click="doComment(blog)">评论</el-button>
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
                  </div>
                </el-card>
              </div>
              <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p>
            </div>
          </el-col>
          <!--        热搜榜和好友推荐-->
          <el-col :span="6" style="margin-top: -3px">
            <HotSearch></HotSearch>
          </el-col>
        </el-row>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
import Header from "@/components/Header";
import HotSearch from "@/components/HotSearch";
import {formatDate} from "_element-ui@2.15.6@element-ui/src/utils/date-util";

export default {
  name: "SearchBlog",
  components: {HotSearch, Header},
  data () {
    return {
      avatarURL: this.$store.state.avatarURL,
      pictureURL: this.$store.state.pictureURL,
      blogs: [],
      currentPage: 1,
      sum: -1,
      loading: false,

      users: [],
      usersLength: 0,
      // 登录者id
      userId: this.$store.getters.getUser.id,
    }
  },
  created() {
    const keyWords = this.$route.params.searchWords
    const formData = new FormData()
    formData.append("keyWords", keyWords)
    this.$axios.post("/user/findUsers", formData, {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    }).then(res => {
      this.users = res.data.data

    })
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
        const keyWords = this.$route.params.searchWords
        const formData = new FormData()
        formData.append("keyWords", keyWords)
        formData.append("currentPage", currentPage)
        _this.$axios.post("/blog/searchBlog", formData,  {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          if (res.data.data.length != 0) {
            _this.blogs = _this.blogs.concat(res.data.data)
          }
          // _this.blogs = res.data.data.records
          _this.currentPage = ++_this.currentPage
          _this.sum = res.data.data.length
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
    },
    // 转发
    doRelay(blog) {
      const formData = new FormData();
      const id = blog.id
      formData.append("blogId", id);
      this.$axios.post("/relay/doRelay", formData, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      }).then(res => {
        blog.relay.relaySize += 1
        blog.relay.isRelay = true
        this.$notify({
          title: '成功',
          message: '转发成功',
          type: 'success'
        });
      }).catch(error => {
        this.$notify.error({
          title: '错误',
          message: '转发失败' + error
        });
      })
    },
    // 评论
    doComment(blog) {
      let myBlog = JSON.stringify(blog)
      this.$router.push({
        path: '/blog/' + blog.id,
        query: {blogMsg: encodeURIComponent(myBlog)}
      })
    },
    // 关注
    doFollow(blog) {
      const formDate = new FormData()
      formDate.append("followeeId", blog.userId)
      if (!blog.hadFollow) {
        this.$axios.post("/follow/doFollow", formDate, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          for(let i =0; i < this.blogs.length; i++) {
            if (this.blogs[i].userId == blog.userId) {
              this.blogs[i].hadFollow = true
            }
          }
        })
      } else {
        this.$axios.post("/follow/unFollow", formDate, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          for(let i =0; i < this.blogs.length; i++) {
            if (this.blogs[i].userId == blog.userId) {
              this.blogs[i].hadFollow = false
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.infinite-list-wrapper {
  height: 849px;
  overflow: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

.user-list {
  height: 110px;
  margin: 5px;
  border-radius: 5px;
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
