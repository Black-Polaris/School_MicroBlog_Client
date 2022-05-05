<template>
  <div id="poster">
    <el-form class="login-container" label-position="left"
             label-width="0px" :model="ruleForm" :rules="rules" ref="ruleForm">
      <h3 class="login_title">账号登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="ruleForm.username"
                  auto-complete="off" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password"
                  auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 40%;border: none;margin-right: 40px" @click="submitForm('ruleForm')">登录</el-button>
        <router-link to="register">
          <el-button type="success" style="width: 40%;border: none">注册</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          this.$axios.post('/login', this.ruleForm)
              .then(res => {
                const jwt = res.headers['authorization']
                const userInfo = res.data.data

                // 把信息共享
                _this.$store.commit("SET_TOKEN", jwt)
                _this.$store.commit("SET_USERINFO", userInfo)

                // 获取用户信息
                // console.log(_this.$store.getters.getUser)

                _this.$router.push('/blogs')
              }).catch(error => {
            this.$notify.error({
              title: '错误',
              message: '账号或者密码错误'
            });
          })
        } else {
          return false;
        }
      });
    },

  }
}
</script>

<style scoped>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 150px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login_title {
  margin: 0px auto 45px auto;
  text-align: center;
  color: #505458;
}
#poster{
  height: 100%;
  width: 100%;
}
body{
  margin: 0px;
}
</style>
