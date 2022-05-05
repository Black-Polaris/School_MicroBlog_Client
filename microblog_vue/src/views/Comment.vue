<template>
  <div>
    <div class="infinite-list-wrapper">
      <div
          class="list"
          infinite-scroll-disabled="disabled">
        <!--        微博卡片-->
        <el-card shadow="hover" style=" margin-bottom: 10px" v-for="comment in commentList" class="list-item" v-show="comment.blog.status != -1">

          <!--          评论我的微博 -->
          <div @click="queryDetail(comment.blog)">
            <el-row :gutter="10">
              <el-col :span="2">
                <div>
                  <el-avatar :src="avatarURL + comment.user.avatar.avatarUrl"></el-avatar>
                </div>
              </el-col>
              <el-col :span="4">
                <div style="font-weight: bold; text-align: left; margin-left: 5px;">
                  <router-link style="text-decoration: none;font-weight: bold;color: #333333;font-family: 'Microsoft YaHei'" :to="{name: 'UserBlogs', params: {userId: comment.user.id}}">
                    {{ comment.user.nickname }}
                  </router-link>
                </div>
              </el-col>
              <el-col :span="4" :offset="14"><div style="font-size: 10px;" dataformatas="yyyy-MM-dd HH:mm:ss">{{ dateFormat('YYYY-mm-dd HH:MM:SS',comment.create_date) }}</div></el-col>
            </el-row>
            <!--            微博内容-->
            <div>
              <el-row type="flex" >
                <el-col :span="2"><div></div></el-col>
                <el-col :span="22">
                  <p style="margin-left: 10px;text-align: left;font-weight: bold">评论微博:&nbsp&nbsp&nbsp&nbsp{{comment.comment_content}}</p>
                </el-col>
              </el-row>

              <el-row type="flex" >
                <el-col :span="2"><div></div></el-col>
                <el-col :span="22">
                  <!--              微博内容-->
                  <div style="border-radius: 5px;background-color: #f2f2f2;padding: 5px">
                    <el-row :gutter="10">
                      <el-col :span="2">
                        <div>
                          <el-avatar :src="comment.blog.user == null ? null : avatarURL + comment.blog.user.avatar.avatarUrl"></el-avatar>
                        </div>
                      </el-col>
                      <el-col :span="4"><div style="font-weight: bold; text-align: left; margin-left: 5px;">{{ comment.blog.user == null ? null : comment.blog.user.nickname }}</div></el-col>
                      <el-col :span="4" :offset="14"><div style="font-size: 10px" dataformatas="yyyy-MM-dd HH:mm:ss">{{ comment.blog.user == null ? null : comment.blog.createDate }}</div></el-col>
                    </el-row>

                    <el-row type="flex" >
                      <el-col :span="2"><div></div></el-col>
                      <el-col :span="22">
                        <p style="margin-left: 10px;text-align: left;font-family: 'Microsoft YaHei'" v-html="comment.blog == null? null :comment.blog.content"></p>
                      </el-col>
                    </el-row>
                    <!--            九宫格图片-->
                    <div style="margin: 5px">
                      <el-row  type="flex" >
                        <el-col :span="2"></el-col>
                        <el-col :span="21">
                          <div>
                            <el-row style="height: 100px;margin: 5px"  type="flex" v-for="i in ((comment.blog.pictures.length)%3 == 0 ? Math.floor((comment.blog.pictures.length)/3) : Math.floor((comment.blog.pictures.length)/3) + 1) ">
                              <el-col style="width: 100px;margin: 5px" :span="7" v-for="j in (comment.blog.pictures.length - 3*(i-1) > 3 ? 3 : comment.blog.pictures.length - 3*(i-1)) ">
                                <el-image
                                    style="width: 100px; height: 100px; border-radius: 5px"
                                    :src="pictureURL + comment.blog.pictures[(i-1)*3+j-1]"
                                    :preview-src-list="getPictureList(i,j,comment.blog.pictures)">
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
          </div>
        </el-card>
      </div>
      <p>没有更多了</p>
    </div>
  </div>
</template>


<script>
export default {
  name: "Comment",
  data () {
    return {
      avatarURL: this.$store.state.avatarURL,
      pictureURL: this.$store.state.pictureURL,
      commentList: [],
      // 登录者id
      userId: this.$store.getters.getUser.id,

    }
  },

  created() {
    const _this = this
    _this.$axios.get("/comment/getCommentList?userId=" + this.userId, {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    }).then(res => {
      _this.commentList = res.data.data
    })
  },
  methods: {
    dateFormat(fmt, date) {
      let ret="";
      date=new Date(date);
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(
              ret[1],
              ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
          )
        }
      }
      return fmt
    },
    // noMore() {
    //   let len = this.likeList.length;
    //   while(len > 0) {
    //     if (this.likeList[--len].blog.status != -1) {
    //       return false;
    //     }
    //     return true;
    //   }
    // },
    // 预览点击的图片
    getPictureList(i, j, pictures) {
      const temp = []
      pictures.forEach(picture => {
        temp.push(this.pictureURL + picture)
      })
      return temp.slice((i-1)*3+j-1).concat(temp.slice(0,(i-1)*3+j-1))
    },

    queryDetail(blog) {
      let myBlog = JSON.stringify(blog)
      this.$router.push({
        path: '/blog/' + blog.id,
        query: {blogMsg: encodeURIComponent(myBlog)}
      })
    }
  }
}
</script>

<style scoped>
.infinite-list-wrapper {
  width: 100%;

  height: 850px;
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
