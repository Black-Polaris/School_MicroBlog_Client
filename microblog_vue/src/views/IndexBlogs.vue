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
                <component :is="comp" v-show="true"></component>
              </keep-alive>
            </el-col>
            <!--        热搜榜和好友推荐-->
            <el-col :span="6">
              <div>热搜榜</div>
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
export default {
  name: "IndexBlogs",
  components: {BlogDetail, Blogs, Header, AsideMenu},
  data() {
    return {
      comp: 'Blogs',
    }
  },

  methods: {
    typeChange() {
      const value = this.$refs.asideMenu.typeId
      if (value === '0')  this.comp = 'Blogs'
      if (value === '1') this.comp = 'BlogDetail'
      if (value === '2') this.comp = 'Blogs'
      if (value === '3') this.comp = 'BlogDetail'
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
