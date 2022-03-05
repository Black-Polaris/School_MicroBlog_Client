<template>
  <div>
    <el-container class="box">
      <!--    header部分-->
      <el-header><Header></Header></el-header>
      <el-container>
        <el-main>
          <div class="main">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <div class="block" style="text-align: center"><el-avatar :size="50" v-bind:src="URL + avatarUrl"></el-avatar></div>

              <el-button size="small" type="primary" @click="dialogOfUpload=true">点击上传</el-button>

              <!-- 上传对话框 -->
              <el-dialog title="上传" :visible.sync="dialogOfUpload" width="35%" style="text-align: center;">
                <el-upload class="upload-demo" action="#" drag multiple :auto-upload="false"
                           :file-list="fileList" :on-change="fileChange">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogOfUpload = false">取 消</el-button>
                  <el-button type="primary" @click="confirmUpload()">上 传</el-button>
                </div>
              </el-dialog>

              <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
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
                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.birthDate" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
                <el-button @click="dialogVisible = true">修改密码</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-main>
      </el-container>
    </el-container>

  <!--    修改密码-->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose">
    <el-form :model="passRuleForm" status-icon :rules="rules" ref="passRuleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="passRuleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="passRuleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitPassForm('passRuleForm')">提交</el-button>
        <el-button @click="resetPassForm('passRuleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
import Header from "@/components/Header";

export default {
  name: "Mine",
  components: {Header},
  inject: ['reload'],
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.passRuleForm.checkPass !== '') {
          this.$refs.passRuleForm.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passRuleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      dialogOfUpload: false,
      URL: "http://localhost:8083/image/",

      avatarUrl: '',
      fileList: [],
      dialogVisible: false,
      ruleForm: {
        username: '',
        nickname: '',
        description: '',
        gender: '',
        birthDate: ''
      },
      passRuleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择一个性别', trigger: 'change' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符'}
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },

  created() {
    if (this.$store.getters.getUser) {
      this.avatarUrl = this.$store.getters.getUser.avatar.avatarUrl
      this.ruleForm.username = this.$store.getters.getUser.username
      this.ruleForm.nickname = this.$store.getters.getUser.nickname
      this.ruleForm.description = this.$store.getters.getUser.description
      this.ruleForm.gender = this.$store.getters.getUser.gender
      this.ruleForm.birthDate = this.$store.getters.getUser.birthDate
    }
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 关闭编辑页面
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    submitPassForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetPassForm(formName) {
      this.$refs[formName].resetFields();
    },
    fileChange(file, fileList) {
      this.fileList = fileList;
    },
    confirmUpload() {
      const fd = new FormData();
      this.fileList.forEach(
          (val, index) => {
            fd.append("file", val.raw);
          }
      );
      this.$axios.post("/avatar/uploadAvatar", fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
            this.avatarUrl = res.data.data.avatarUrl
            const tempUserInfo = JSON.parse(sessionStorage.getItem("userInfo"))
            let pojo = tempUserInfo
            pojo.avatar = res.data.data
            this.$store.getters.getUser.avatar.avatarUrl = this.avatarUrl
            sessionStorage.setItem("userInfo", JSON.stringify(pojo))
            this.reload()
            console.log(this.avatarUrl)
            this.dialogOfUpload = false;
            this.$message({
              message: "上传成功！",
              duration: 1000
            });
        });
    }
  }
}
</script>

<style scoped>
.box {
  width: 100%;
  background-color: #fff;
}
.main {
  border-radius: 5px;
  width: 600px;
  height: 820px;
  margin: 0 auto;
}

</style>
