<template>
  <div>
<!--    导航菜单-->
    <el-menu :default-active="this.$route.path"
             router
             class="el-menu-demo"
             mode="horizontal"
             background-color="white"
             text-color="#222"
             active-text-color="red">
      <el-menu-item v-for="(item,i) in navList" :key=i :index="item.name">
        {{item.navItem}}
      </el-menu-item>

<!--      登录和退出按钮-->
      <span v-show="!hasLogin"><el-button class="el-icon-switch-button" type="primary" round style="float:right;margin: 10px;" href="/login" @click="login">登录</el-button></span>
      <span v-show="hasLogin"><el-button class="el-icon-switch-button" type="danger" round style="float:right;margin: 10px" @click="logout">退出</el-button></span>
<!--      发表微博和头像-->
      <el-button type="primary" icon="el-icon-edit" round style="float:right;margin: 10px;" @click="dialogVisible = true">发表微博</el-button>
      <el-avatar :size="40" :src="avatarURL + user.avatar" style="float:right;margin: 10px;"></el-avatar>

<!--      微博搜索栏-->
      <div style="text-align: center;margin: 15px">
        <el-input
            @keyup.enter.native="searchClick"
            placeholder="搜索微博"
            prefix-icon="el-icon-search"
            size="small"
            clearable
            style="width: 200px;margin-right: 10px"
            v-model="searchWords">
        </el-input>
        <router-link :to="{name: 'SearchBlog', params: {searchWords: searchWords}}">
          <el-button size="small" type="primary" icon="el-icon-search" >搜索</el-button>
        </router-link>
      </div>
    </el-menu>

<!--    微博编辑页面-->
    <el-dialog
        :visible.sync="dialogVisible"
        :before-close="handleClose">
     <BlogEdit @closeBlogEdit = "dialogVisible = false" ref="blogEdit"></BlogEdit>
    </el-dialog>

  </div>
</template>

<script>

import BlogEdit from "@/views/BlogEdit";
export default {
  name: "Header",
  components: {BlogEdit},
  inject: ['reload'],
  data() {
    return {
      navList:[
        {name:'/blogs',navItem:'首页'},
        {name:'/login',navItem: '私信'},
        {name:'/Mine',navItem: '个人中心'}
      ],

      // 查找内容
      searchWords: '',
      avatarURL: this.$store.state.avatarURL,
      user: {
        username: '请先登录',
        avatar:""
      },
      hasLogin: false,
      dialogVisible: false

    }
  },
  methods: {
    // 登录
    login() {
      this.$router.push("/login")
    },

    // 退出登录
    logout() {
      const _this = this
      // 由于在后端的接口中logout是需要认证后才有权限的，所以将token传入
      _this.$axios.get("/logout", {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      }).then(res => {
        _this.$store.commit("REMOVE_INFO")
        _this.$router.push("/login")
      })
    },
    // 关闭编辑页面
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
  },
  // 回显用户信息
  created() {
    if (this.$store.getters.getUser.username) {
      this.user.username = this.$store.getters.getUser.username
      this.user.avatar = this.$store.getters.getUser.avatar.avatarUrl
      this.hasLogin = true
    }
  }

}
</script>

<style scoped>

</style>
