<template>
  <div id="paper">
    <el-form class="login-container" :label-position="right"
             :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <h3 class="login_title">用户注册</h3>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="ruleForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日" >
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="ruleForm.birthDate" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 40%; background: #505458;border: none;margin-right: 40px" @click="submitForm('ruleForm')">点击注册</el-button>
        <el-button type="primary" style="width: 40%;background-color: #505458;border: none" @click="backLogin">返回</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      ruleForm: {
        username: '',
        password: '',
        nickname: '',
        description: '',
        gender: '',
        birthDate: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '昵称', trigger: 'blur' },
          { min: 1, message: '长度最少为1个字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择一个性别', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符'}
        ],
      }
    };
  },
  methods: {
    // 修改个人信息
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post("/user/addUser", {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            nickname: this.ruleForm.nickname,
            description: this.ruleForm.description,
            gender: this.ruleForm.gender,
            birthDate: this.ruleForm.birthDate
          }).then(res => {
            console.log(res.data.data)
            this.$router.push("/login")
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success'
            });
          }).catch(error => {
            this.$notify.error({
              title: '错误',
              message: '创建失败' + error
            });
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '创建失败'
          });
          return false;
        }
      });
    },
    backLogin() {
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
#paper {
  height: 100%;
  width: 100%;
}
body{
  margin: -5px 0px;
}
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
