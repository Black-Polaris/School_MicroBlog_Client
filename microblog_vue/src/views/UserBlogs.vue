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
            <!--            微博内容-->
            <div>
              <div class="list"
                   v-infinite-scroll="load"
                   infinite-scroll-disabled="disabled">
                <!--        微博卡片-->
                <el-card shadow="hover" style=" margin-bottom: 10px" class="list-item" v-for="blog in blogs" v-show="blog.status != -1">
                  <!--          原创状态微博-->
                  <div v-show="blog.status == 1">
                    <el-row :gutter="10">
                      <el-col :span="2">
                        <div>
                          <el-avatar :src="avatarURL + blog.user.avatar.avatarUrl"></el-avatar>
                        </div>
                      </el-col>
                      <el-col :span="4"><div style="font-weight: bold; text-align: left; margin-left: 5px;">{{ blog.user.nickname }}</div></el-col>
                      <el-col :span="4" :offset="11"><div style="font-size: 10px;" dataformatas="yyyy-MM-dd HH:mm:ss">{{ blog.createDate }}</div></el-col>
                      <el-col :span="3">
                        <el-button v-show="user.id != userId" :class="blog.hadFollow?'el-icon-star-on':'el-icon-star-off'" :type="blog.hadFollow?'success':'primary'" round @click="doFollow(blog)">
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
                      <el-col :span="4"><div style="font-weight: bold; text-align: left; margin-left: 5px;">{{ blog.user.nickname }}</div></el-col>
                      <el-col :span="4" :offset="11"><div style="font-size: 10px;" dataformatas="yyyy-MM-dd HH:mm:ss">{{ blog.createDate }}</div></el-col>
                      <el-col :span="3">
                        <el-button v-show="user.id != userId" :class="blog.hadFollow?'el-icon-star-on':'el-icon-star-off'" :type="blog.hadFollow?'success':'primary'" round @click="doFollow(blog)">
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
                                  <el-avatar :src="avatarURL + (blog.fromBlog == null ? null : blog.fromBlog.user.avatar.avatarUrl)"></el-avatar>
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
            <el-card class="box-card">
              <el-descriptions title="博主信息" :column="1">
                <el-descriptions-item label="用户名">{{ user.nickname }}</el-descriptions-item>
                <el-descriptions-item label="简介">{{ user.description }}</el-descriptions-item>
                <el-descriptions-item label="性别">
                  <el-tag size="small">{{ user.gender }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="出生日期">{{ user.birthDate}}</el-descriptions-item>
              </el-descriptions>
              <el-button v-show="user.id != userId" class="el-icon-s-comment" type="primary" round style="margin: 10px;" @click="dialogVisible = true">
                私信
              </el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-main>

      <el-dialog
          width="850px"
          :visible.sync="dialogVisible">
        <div class="dialog">
          <div class="top">
            <h3 style="text-align: center">聊天室</h3>
          </div>
          <div class="middle" @mouseover="over" @mouseout="out">
            <div v-if="msgList.length">
              <div v-for="msg in msgList">
                <div class="msg" :style="msg.fromId != userId ? 'flex-direction: row;' : 'flex-direction: row-reverse;'">
                  <div class="avatar">
                    <el-avatar :src="avatarURL + msg.fromUser.avatar.avatarUrl"/>
                  </div>
                  <div v-if="msg.fromId != userId" style="flex: 13;">
                    <div class="bubble-msg-left" style="margin-right: 75px;">
                      {{ msg.message }}
                    </div>
                  </div>
                  <div v-else style="flex: 13;">
                    <div class="bubble-msg-right" style="margin-left: 75px;">
                      {{ msg.message }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="line"></div>
          <div class="bottom">
            <label>
        <textarea
            class="messageText"
            maxlength="256"
            v-model="msg"
            :placeholder="hint"
            @keydown.enter="sendMsg($event)"
        ></textarea>
            </label>
            <button class="send" :class="{emptyText: isEmptyText}" title="按下 ENTER 发送" @click="sendMsg()">发送</button>
          </div>
        </div>
      </el-dialog>

    </el-container>
  </el-container>
</template>

<script>
import HotSearch from "@/components/HotSearch";
import Header from "@/components/Header";
import Emoji from "@/components/Emoji";
import {formatDate} from "_element-ui@2.15.6@element-ui/src/utils/date-util";

export default {
  name: "UserBlogs",
  components: {HotSearch, Header, Emoji},
  data() {
    return {
      avatarURL: this.$store.state.avatarURL,
      pictureURL: this.$store.state.pictureURL,
      blogs: [],
      currentPage: 1,
      total: 100,
      sum: -1,
      loading: false,
      // 查看的用户id
      user: {},

      dialogVisible: false,
      msg: '',
      hint: '',
      socket: null,
      bubbleMsg: '',
      interval: null,
      isEmptyText: true,
      // 登录者id
      userId: this.$store.getters.getUser.id,
      msgList: []
    }
  },
  created() {
    let userId = decodeURIComponent(this.$route.params.userId)
    this.$axios.get("/user/findUserById?userId=" + userId )
        .then(res => {
          this.user = res.data.data
        })
  },
  mounted() {
    if ("WebSocket" in window) {
      this.socket = new WebSocket('ws://localhost:8083/websocket/' + this.userId)
    } else {
      alert("不支持建立socket连接");
    }
    this.socket.onmessage = event => {
      this.msgList.push(JSON.parse(event.data))
    }
    // 为防止网络和其他一些原因，每隔一段时间自动从信箱中获取信息
    this.interval = setInterval(() => {
      const formDate = new FormData()
      formDate.append("fromId", this.$store.getters.getUser.id)
      formDate.append("toId", this.user.id)

      this.$axios.post("/message/pullBothMsg", formDate,{
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      }).then(res => {
        this.msgList = res.data.data
      }).catch(err => {
        console.log(err)
      })
    }, 15000)
  },
  beforeDestroy() {
    // 清楚定时器的设置
    !this.interval &&clearInterval(this.interval)
  },
  watch: {
    msgList() {
      // 保证滚动条(如果存在), 始终在最下方
      const mid = document.querySelector('.middle')
      this.$nextTick(() => {
        mid && (mid.scrollTop = mid.scrollHeight)
        document.querySelector('.messageText').focus()
      })
    },
    msg() {
      this.isEmptyText = !this.msg
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
        let userId = decodeURIComponent(this.$route.params.userId)
        const formData = new FormData()
        formData.append('userId', userId)
        formData.append('currentPage', currentPage)
        _this.$axios.post("/blog/userBlogs", formData,  {
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
      return temp.slice((i - 1) * 3 + j - 1).concat(temp.slice(0, (i - 1) * 3 + j - 1))
    },
    // 点赞
    doLike(blog) {
      blog.createDate = formatDate(blog.createDate, "yyyy-MM-dd HH:mm:ss")
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
    // 关闭编辑页面
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    // 评论
    doComment(blog) {
      let myBlog = JSON.stringify(blog)
      this.$router.push({
        path: '/blog/' + blog.id,
        query: {blogMsg: encodeURIComponent(myBlog)}
      })
    },

    over() {
      this.setColor('#c9c7c7')
    },
    out() {
      this.setColor('#0000')
    },
    setColor(color) {
      document.documentElement.style.setProperty('--scroll-color', `${color}`)
    },
    sendMsg(e) {
      if (e) {
        e.preventDefault()
      }
      if (!this.msg) {
        this.hint = '信息不可为空！'
        return
      }
      let entity = {
        fromId: this.$store.getters.getUser.id,
        toId: this.user.id,
        message: this.msg,
        createDate: new Date()
      }
      this.socket.send(JSON.stringify(entity))
      this.msg = ''
      this.hint = ''
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

:root {
  --scroll-color: #0000;
}
.dialog {
  border-radius: 5px;
  border: 1px solid #87ceeb;
  margin: 0 auto;
  width: 800px;
  background: #f2f2f2;
}
.name {
  position: relative;
  top: 22px;
  left: 25px;
}
.info {
  width: 719px;
  height: 100%;
  display: flex;
  align-items: center;
}
.info .msg {
  flex: 1;
  text-align: center;
}
.top {
  width: 100%;
  height: 60px;
  border-bottom: #d0d0d0 1px solid;
}
.top::after {
  content: " ";
  float: right;
  position: relative;
  top: 40px;
  border: 4px solid #0000;
  border-top-color: #8e9292;
}
.middle {
  height: 432px;
  overflow: auto;
  padding: 10px;
  margin: 6px 0 11px 0;
}
.middle::-webkit-scrollbar {
  width: 8px;
  height: 1px;
}
.middle::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: var(--scroll-color);
}
.middle::-webkit-scrollbar-track {
  background: #efeded;
  border-radius: 4px;
}
.middle .msg {
  display: flex;
}
.avatar {
  margin: 8px;
  flex: 1;
}
.avatar img {
  width: 36px;
  height: 36px;
  border-radius: 4px;
}
.bubble-msg-left, .bubble-msg-right {
  padding: 10px;
  font-size: 14px;
  margin-top: 10px;
  line-height: 24px;
  border-radius: 5px;
  width: fit-content;
  line-break: anywhere;
}
.bubble-msg-left {
  float: left;
  color: black;
  margin-left: -12px;
  text-indent: -0.5em;
  background-color: white;
}
.bubble-msg-right {
  float: right;
  color: white;
  background-color: #1e6ee1;
}
.bubble-msg-right::before {
  content: " ";
  float: right;
  position: relative;
  left: 18px;
  border: 4px solid #0000;
  border-left-color: #1e6ee1;
}
.bubble-msg-left::before {
  content: " ";
  float: left;
  position: relative;
  left: -18px;
  border: 4px solid #0000;
  border-right-color: white;
}
.line {
  width: 100%;
  height: 0;
  position: relative;
  top: -6px;
  border-top: #d0d0d0 1px solid;
}
.dialog .bottom {
  padding-left: 10px;
  padding-right: 25px;
}
.messageText {
  position: relative;
  margin-right: 2px;
  margin-bottom: 5px;
  font: 14px/1.5 Helvetica,Arial,Tahoma,微软雅黑;
  width: 102%;
  height: 106px;
  outline: none;
  background: white;
  border: 0 none;
  overflow-y: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  resize: none;
  vertical-align: middle;
  display: inline-block;
}
.dialog .bottom::after {
  content: " ";
  float: right;
  position: relative;
  top: -121px;
  left: 75px;
  border: 4px solid #0000;
  border-bottom-color: #8e9292;
}
.send {
  float: right;
  position: relative;
  top: -30px;
  left: 10px;
  background-color: #51a5e6;
  border: #87ceeb;
  color: #fff;
  font-size: 12px;
  width: 50px;
  height: 22px;
  border-radius: 3px;
}
.send:focus{
  outline: none;
}
.emptyText {
  background-color: #d0d0d0;
}

</style>
