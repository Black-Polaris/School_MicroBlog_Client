<template>
  <div>
    <div class="m-content">
      <h3>欢迎光临</h3>
      <el-avatar :size="50" :src="user.avatar"></el-avatar>
      <div>{{ user.username }}</div>
      <div class="m-action">
        <span><el-link type="primary">主页</el-link></span>
        <el-divider direction="vertical"></el-divider>
        <span><el-link type="success">发表博客</el-link></span>

        <el-divider direction="vertical"></el-divider>
        <span v-show="!hasLogin"><el-link type="info" href="/login" @click="login">登录</el-link></span>
        <span v-show="hasLogin"><el-link type="danger" @click="logout">退出</el-link></span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      user: {
        username: '请先登录',
        avatar:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
      },
      hasLogin: false

    }
  },
  methods: {
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
    }
  },
  // 回显用户信息
  created() {
    if (this.$store.getters.getUser.username) {
      this.user.username = this.$store.getters.getUser.username
      this.user.avatar = this.$store.getters.getUser.avatar

      this.hasLogin = true
    }
  }

}
</script>

<style scoped>
  .m-content {
    max-width: 960px;
    margin: 0 auto;
    text-align: center;
  }

  .m-action {
    margin: 10px 0;
  }

</style>
