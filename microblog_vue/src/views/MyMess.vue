<template>
  <el-container class="box">
    <!--    header部分-->
    <el-header><Header></Header></el-header>
    <!--    <BlogEdit></BlogEdit>-->
    <el-container>
      <!--      aside部分-->
      <el-aside width="200px" style="margin-top: 3px">
        <MyMessAsideMenu @indexSelect="typeChange" ref="asideMenu"></MyMessAsideMenu>
      </el-aside>
      <el-main style="padding: 3px;border-radius: 5px">
        <!--        main部分-->
        <el-row>
          <!--        微博列表-->
          <el-col :span="18">
            <keep-alive>
              <component :is="comp" :key="componentKey" v-show="true"></component>
            </keep-alive>
          </el-col>
          <!--        热搜榜和好友推荐-->
          <el-col :span="6">
            <HotSearch></HotSearch>
          </el-col>
        </el-row>
      </el-main>

    </el-container>
  </el-container>
</template>


<script>
import MyMessAsideMenu from "@/components/MyMessAsideMenu";
import Header from "@/components/Header";
import HotSearch from "@/components/HotSearch";
import Comment from "@/views/Comment";
import Like from "@/views/Like";
export default {
  name: "MyMess",
  components: {HotSearch, Header, MyMessAsideMenu, Comment, Like},
  data() {
    return {
      comp: 'Comment',
      componentKey: 0
    }
  },
  methods: {
    typeChange() {
      const value = this.$refs.asideMenu.typeId
      if (value === '0') {
        this.comp = 'Comment'
        this.componentKey += 1
      }
      if (value === '1') {
        this.comp = 'Like'
        this.componentKey += 1
      }
    }
  }
}
</script>

<style scoped>

.box {
  width: 100%;
  background-color: #fff;
}

.el-row {
  margin-bottom: 0px;
&:last-child {
   margin-bottom: 0;
 }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-row {
  text-align: center;
}

</style>
