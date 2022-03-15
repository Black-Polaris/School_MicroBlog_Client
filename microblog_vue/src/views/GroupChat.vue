<template>
  <el-container class="box">
    <!--    header部分-->
    <el-header><Header></Header></el-header>
    <el-container>
      <el-main>
        <div class="dialog">
          <div class="top">
            <h3 style="text-align: center">聊天室</h3>
          </div>
          <div class="middle" @mouseover="over" @mouseout="out">
            <div v-if="msgList.length">
              <div v-for="msg in msgList">
                <div class="msg" :style="msg.userId != userId ? 'flex-direction: row;' : 'flex-direction: row-reverse;'">
                  <div class="avatar">
                    <el-avatar :src="avatarURL + msg.user.avatar.avatarUrl"/>
                  </div>
                  <div v-if="msg.userId != userId" style="flex: 13;">
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
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import Header from "@/components/Header";

export default {
  name: "GroupChat",
  components: {Header},
  created() {
    this.$axios.get("/message/pullMsg", {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    }).then(res => {
      this.msgList = res.data.data
    }).catch(err => {
      console.log(err)
    })
  },
  mounted() {
    if ("WebSocket" in window) {
      this.socket = new WebSocket('ws://localhost:8083/websocket')
    } else {
      alert("不支持建立socket连接");
    }
    this.socket.onmessage = event => {
      this.msgList.push(JSON.parse(event.data))
    }
    // 为防止网络和其他一些原因，每隔一段时间自动从信箱中获取信息
    this.interval = setInterval(() => {
      this.$axios.get("/message/pullMsg", {
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
  data() {
    return {
      avatarURL: this.$store.state.avatarURL,
      msg: '',
      hint: '',
      socket: null,
      bubbleMsg: '',
      interval: null,
      isEmptyText: true,
      userId: this.$store.getters.getUser.id,
      msgList: []
    }
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
  methods: {
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
        userId: this.$store.getters.getUser.id,
        message: this.msg,
        createDate: new Date()
      }
      this.socket.send(JSON.stringify(entity))
      console.log(this.msgList)
      this.msg = ''
      this.hint = ''
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

