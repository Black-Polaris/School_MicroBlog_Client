<template>
  <div class="box">
    <div class="infinite-list-wrapper">
      <ul
          class="list"
          v-infinite-scroll="load"
          infinite-scroll-disabled="disabled">
        <li style="height: 100px" v-for="i in count" class="list-item">{{ i }}</li>
      </ul>
      <p><el-button @click="load">加载更多</el-button></p>
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多了</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      count: 50,
      loading: false
    }
  },
  computed: {
    noMore () {
      return this.count >= 200
    },
    disabled () {
      console.log(this.loading +"*********" + this.noMore)
      return this.loading || this.noMore
    }
  },
  methods: {
    load () {
      this.loading = true
      setTimeout(() => {
        this.count += 2
        this.loading = false
      }, 500)
    }
  }
}
</script>

<style scoped>
.infinite-list-wrapper {

  height: 900px;
  overflow: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)

}

.box {
  width: 100%;
  background-color: #fff;


}



</style>
