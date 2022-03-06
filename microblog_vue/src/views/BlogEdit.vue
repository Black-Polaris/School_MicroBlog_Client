<template>
  <div style="margin: 30px">
    <h3>发布微博</h3>
    <div>
      <el-input
          v-model="textarea"
          class="chatText"
          resize="none"
          type="textarea"
          id='textarea'
          rows="5"
          @keyup.enter.native="sendInfo"
      ></el-input>
    </div>
    <div >
      <el-row type="flex" >
        <el-col :span="3">
          <Emoji></Emoji>
        </el-col>
        <el-col :offset="20">
          <el-button style="margin-top: 5px" type="primary">发布</el-button>
        </el-col>
      </el-row>
<!--      上传图片-->
      <el-row >
          <div>
            <el-upload
                action="#"
                :auto-upload="false"
                class="upload-demo"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :before-remove="beforeRemove"
                multiple
                :limit="9"
                :on-exceed="handleExceed">
              <el-button size="small" type="primary">点击上传jpeg图片</el-button>
            </el-upload>

            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogavatarURL" alt="">
            </el-dialog>
          </div>
      </el-row>
    </div>

  </div>
</template>

<script>
import Emoji from "@/components/Emoji";
export default {
  name:"BlogEdit",
  components: {Emoji},
  data () {
    return {
      textarea: "",

      // 上传图片
      dialogavatarURL: '',
      dialogVisible: false
    }
  },
  computed: {

  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogavatarURL = file.url;
      this.dialogVisible = true;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多只能上传9张图片`);
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    }
  }
}
</script>

<style scoped>


</style>
