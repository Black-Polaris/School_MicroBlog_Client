<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" style="margin: 0 auto;width: 95%;height: 850px">
    <el-tab-pane label="小时榜" name="first"><Blogs v-if="isChildUpdate1"></Blogs></el-tab-pane>
    <el-tab-pane label="日榜" name="second"><Blogs v-if="isChildUpdate2"></Blogs></el-tab-pane>
    <el-tab-pane label="周榜" name="third"><Blogs v-if="isChildUpdate3"></Blogs></el-tab-pane>
    <el-tab-pane label="月榜" name="fourth"><Blogs v-if="isChildUpdate4"></Blogs></el-tab-pane>
  </el-tabs>
</template>

<script>
import Blogs from "@/views/Blogs";
export default {
  name: "HeaderTabs",
  components: {Blogs},
  data() {
    return {
      activeName: 'first',
      isChildUpdate1: true,
      isChildUpdate2: false,
      isChildUpdate3: false,
      isChildUpdate4: false
    };
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == "first") {
        this.isChildUpdate1 = true;
        this.isChildUpdate2 = false;
        this.isChildUpdate3 = false;
        this.isChildUpdate4 = false;
      } else if (tab.name == "second") {
        this.isChildUpdate1 = false;
        this.isChildUpdate2 = true;
        this.isChildUpdate3 = false;
        this.isChildUpdate4 = false;
      } else if (tab.name == "third") {
        this.isChildUpdate1 = false;
        this.isChildUpdate2 = false;
        this.isChildUpdate3 = true;
        this.isChildUpdate4 = false;
      } else if (tab.name = 'fourth') {
        this.isChildUpdate1 = false;
        this.isChildUpdate2 = false;
        this.isChildUpdate3 = false;
        this.isChildUpdate4 = true;
      }
    }
  }
}
</script>

<style scoped>

</style>
