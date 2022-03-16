<template>
  <el-container class="box">
    <!--    header部分-->
    <el-header><Header></Header></el-header>
    <el-container>
      <el-main>
        <div>
          <div class="main">
            <Contact @set-contact="set"/>
            <Dialog :contact="contact" :msgList="msgList"/>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from "@/components/Header";
import Contact from '@/components/Contact'
import Dialog from '@/components/Dialog'
export default {
  name: "Chat",
  components: {
    Dialog,
    Contact,
    Header
  },
  data() {
    return {
      contact: null,
      msgList: []
    }
  },
  methods: {
    set(user) {
      this.contact = user
      const formDate = new FormData()
      formDate.append("fromId", this.$store.getters.getUser.id)
      formDate.append("toId", this.contact.id)

      this.$axios.post("/message/pullBothMsg", formDate,{
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      }).then(res => {
        this.msgList = res.data.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.box {
  width: 100%;
  height: 900px;
  background-color: #fff;
}

.main {
  width: 1080px;
  height: 648px;
  margin-top: 72px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  background-color: #efeded;
  border: #d0d0d0 1px solid;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>
