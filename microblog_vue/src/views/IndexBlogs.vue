<template>
  <el-container class="box">
      <!--    header部分-->
      <el-header><Header></Header></el-header>
      <!--    <BlogEdit></BlogEdit>-->
      <el-container>
        <!--      aside部分-->
        <el-aside width="200px" style="margin-top: 3px">
          <AsideMenu @indexSelect="typeChange" ref="asideMenu"></AsideMenu>
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
import Header from "@/components/Header";
import AsideMenu from "@/components/AsideMenu";
import Blogs from "@/views/Blogs";
import BlogDetail from "@/views/BlogDetail";
import MyBlog from "@/views/MyBlog";
import LatestBlog from "@/views/LatestBlog";
import HotSearch from "@/components/HotSearch";
import HeaderTabs from "@/components/HeaderTabs";
import HotSearchList from "@/views/HotSearchList";
export default {
  name: "IndexBlogs",
  components: {HotSearchList, HeaderTabs, HotSearch, LatestBlog,MyBlog,BlogDetail, Blogs, Header, AsideMenu},
  data() {
    return {
      comp: 'HeaderTabs',
      componentKey: 0
    }
  },

  methods: {
    typeChange() {
      const value = this.$refs.asideMenu.typeId
      if (value === '0') {
        this.comp = 'HeaderTabs'
        this.componentKey += 1
      }

      if (value === '1') {
        this.comp = 'LatestBlog'
        this.componentKey += 1
      }
      if (value === '2') {
        this.comp = 'MyBlog'
        this.componentKey += 1
      }
      if (value === '3') {
        this.comp = 'HotSearchList'
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
