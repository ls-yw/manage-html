<template>
  <el-row class="container">
    <el-col v-for="(item,index) in contents" :key="index" :span="item.type && item.type === 'row' ? 24 : 4" :class="'list '+item.class">
      <div v-if="item.data && item.data.from_id"><a :href="item.data.from_url" target="_blank">{{ item.message }}</a> [<span class="orange" @click="handleConfirmCollect(item.data, $event)">确认</span>] [<a href="" class="green"> 添加</a>]</div>
      <div v-else> {{ item.message }}</div>
    </el-col>
  </el-row>
</template>

<script>
import ReconnectingWebSocket from 'reconnecting-websocket'
import { getToken } from '@/utils/auth'
import { confirmNovelCollectArticleApi } from '@/api/novel/collect'

export default {
  name: 'Do',
  data() {
    return {
      bookId: this.$route.query.bookId || 0,
      contents: []
    }
  },
  destroyed() {
    this.closeWebSocket()
  },
  mounted() {
    // 创建 websocket 链接
    this.createWebsocket()
  },
  created() {
    setTimeout(this.goCollect, 1000)
  },
  methods: {
    // 创建 websocket 链接
    createWebsocket() {
      const httpURL = process.env.VUE_APP_WEBSOCKET_HOST
      this.websocket = new ReconnectingWebSocket(httpURL + '/collect')
      // 连接发生错误的回调方法
      this.websocket.onerror = this.websocketOnerror
      // 连接成功建立的回调方法
      this.websocket.onopen = this.websocketOnopen
      // 接收到消息的回调方法
      this.websocket.onmessage = this.websocketOnmessage
      // 连接关闭的回调方法
      this.websocket.onclose = this.websocketOnclose
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      this.websocket.onbeforeunload = this.websocketOnbeforeunload
    },
    // 连接发生错误的回调方法
    websocketOnerror() {
      console.log('连接发生错误的回调方法')
    },
    // 连接成功建立的回调方法
    websocketOnopen() {
      // 发送token信息验证登录
      this.websocket.send('{ "action":"checkLogin", "token": "' + getToken() + '" }')
      console.log('连接成功建立的回调方法')
    },
    // 接收到消息的回调方法
    websocketOnmessage(event) {
      const result = JSON.parse(event.data)
      if (result.code === 0) {
        this.contents.unshift(result)
        if (result.data && result.data.action) {
          switch (result.data.action) {
            case 'closed':
              this.closeWebSocket()
              break
          }
        }
      } else if (result.code === 200) {
        this.$message.success(result.message)
        return false
      } else {
        this.$message.error(result.message)
        return false
      }
    },
    // 连接关闭的回调方法
    websocketOnclose() {
      console.log('连接关闭的回调方法')
    },
    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常
    websocketOnbeforeunload() {
      this.closeWebSocket()
      console.log('监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常')
    },
    // 关闭WebSocket连接
    closeWebSocket() {
      this.websocket.close()
    },
    goCollect() {
      this.websocket.send('{ "action":"collectArticle", "bookId": "' + this.bookId + '" }')
    },
    handleConfirmCollect(row, event) {
      const e = event.currentTarget
      if (e.className !== 'gray') {
        confirmNovelCollectArticleApi({ ids: [row.from_id] }).then(response => {
          this.$message.success('确认成功')
          e.className = 'gray'
          e.innerHTML = '已确认'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container{
    margin: 20px;
    .list{
        line-height: 26px;
        font-size: 14px;
    }
}
</style>
