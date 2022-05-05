<template>
  <div class="box">
    <el-menu class="box"
             default-active="0"
             @select="handleSelect"
             active-text-color="orange">
      <el-menu-item index = "0">
        <i class="el-icon-chat-dot-round"></i>
        <span style="padding: 5px">评论</span>
        <el-badge :value="commentCount" v-if="commentCount > 0" class="item" size="mini" style="bottom: 10px"></el-badge>
      </el-menu-item>
      <el-menu-item index = "1">
        <i class="el-icon-chat-dot-round"></i>
        <span style="padding: 5px">点赞</span>
        <el-badge :value="likeCount" v-if="likeCount > 0" class="item" size="mini" style="bottom: 10px"></el-badge>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import {EventBus} from "@/event-bus";
export default {
  name: "MyMessAsideMenu",
  data(){
    return{
      typeId:'',
      commentCount: 0,
      likeCount: 0,
    }
  },
  created() {
    if(this.$store.getters.getUser.id != null){
      const formData = new FormData();
      formData.append("userId", this.$store.getters.getUser.id);
      this.$axios.post("/blog/getCount", formData, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      }).then(res => {
            this.commentCount = res.data.data.commentCount || 0;
            this.likeCount = res.data.data.likeCount || 0;
          })
    }
  },
  methods:{
    handleSelect(key){
      this.typeId = key
      this.$emit('indexSelect')
      if(key == 0) {
        const formData = new FormData();
        formData.append("userId", this.$store.getters.getUser.id);
        formData.append("typeId", key);
        this.$axios.post("/blog/readMess", formData, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          EventBus.$emit("Msg", res.data.data.commentCount);
          this.commentCount = 0
        })
      }else if(key == 1) {
        const formData = new FormData();
        formData.append("userId", this.$store.getters.getUser.id);
        formData.append("typeId", key);
        this.$axios.post("/blog/readMess", formData, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          EventBus.$emit("Msg", res.data.data.likeCount);
          this.likeCount = 0
        })
      }

    }

  }
}
</script>

<style scoped>
.box {
  height: 850px;
}
</style>
