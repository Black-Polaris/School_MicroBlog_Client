<template>

    <div class="chatIcon"  style="float: left">
      <el-popover placement="bottom-start" width="400" trigger="click" class="emoBox">
        <div class="emotionList">
          <a href="javascript:void(0);" @click="getEmo(index)" v-for="(item,index) in faceList" :key="index" class="emotionItem">{{item}}</a>
        </div>
        <el-button
            class="emotionSelect"
            slot="reference"
        ></el-button>
      </el-popover>

    </div>

</template>

<script>

export default {

  name: "Emoji",

  mounted() {
    const emojiData = require("../utils/emoji.json")
    for(let i in emojiData){
      this.faceList.push(emojiData[i].char);
    }
  },
  data() {
    return {
      faceList: [],
    };
  },
  methods: {
    getEmo(index){
      var textArea=document.getElementById('textarea');
      function changeSelectedText(obj, str) {
        if (window.getSelection) {
          // 非IE浏览器
          textArea.setRangeText(str);
          // 在未选中文本的情况下，重新设置光标位置
          textArea.selectionStart += str.length;
          textArea.focus()
        } else if (document.selection) {
          // IE浏览器
          obj.focus();
          var sel = document.selection.createRange();
          sel.text = str;
        }
      }
      changeSelectedText(textArea,this.faceList[index]);
      this.textarea=textArea.value;// 要同步data中的数据
      // console.log(this.faceList[index]);
      return;
    }
  }



}
</script>



<style scoped>
.emotionSelect {
  background: url('../assets/emoji.png') no-repeat;
  width: 50px;
  height: 50px;
  border: none;
  background-size: cover;
}

.chatIcon {
  padding: 0 10px;
  font-size: 25px;
}
.emotionList{
  display: flex;
  flex-wrap: wrap;
  padding:5px;
}
.emotionItem{
  width:10%;
  font-size:20px;
  text-align:center;
}
/*包含以下四种的链接*/
.emotionItem {
  text-decoration: none;
}
/*正常的未被访问过的链接*/
.emotionItem:link {
  text-decoration: none;
}
/*已经访问过的链接*/
.emotionItem:visited {
  text-decoration: none;
}
/*鼠标划过(停留)的链接*/
.emotionItem:hover {
  text-decoration: none;
}
/* 正在点击的链接*/
.emotionItem:active {
  text-decoration: none;
}
</style>

