<template>
  <div class="app-container">
    <el-card v-loading="loading" class="box-card">
      <div slot="header" class="clearfix">
        <span>采集测试（{{ $route.query.name }} - {{ $route.query.host }}）</span>
      </div>
      <el-form ref="form" :rules="rules" :model="formData" label-width="100px">
        <el-form-item label="采集类型" prop="host">
          <el-radio-group v-model="formData.type">
            <el-radio :label="1">信息页</el-radio>
            <el-radio :label="2">目录页</el-radio>
            <el-radio :label="3">内容页</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="网址" prop="url">
          <el-col :span="20">
            <el-input v-model="formData.url" />
          </el-col>
          <el-col :span="4" align="center">
            <el-button type="success" @click="goTest">测试</el-button>
          </el-col>

        </el-form-item>
        <el-form-item label="内容" prop="host_name">
          <el-form-item v-for="(item,key) in content" :key="key" :label="key">
            {{ item }}
          </el-form-item>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getNovelCollectTestApi } from '@/api/novel/collect'

export default {
  name: 'Test',
  data() {
    return {
      formData: {
        type: 1,
        collectId: this.$route.query.collectId,
        url: 'https://www.zwwx.com/book/0/24/'
      },
      rules: {
        url: [{ required: true, message: '请填写测试网址', trigger: 'blur' }]
      },
      loading: false,
      content: ''
    }
  },
  methods: {
    goTest() {
      this.loading = true
      getNovelCollectTestApi(this.formData).then(response => {
        this.content = response.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
