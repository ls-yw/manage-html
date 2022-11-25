<template>
  <div v-loading="loading" class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="系统配置">
        <el-form ref="form1" :model="configs.system" label-width="80px">
          <el-form-item label="活动名称">
            <el-input v-model="configs.system.name" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('system')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="博客配置">
        <el-form ref="form2" :model="configs.blog" label-width="100px">
          <el-form-item label="网站域名">
            <el-input v-model="configs.blog.host" />
          </el-form-item>
          <el-form-item label="网站名称">
            <el-input v-model="configs.blog.host_name" />
          </el-form-item>
          <el-form-item label="SEO名称">
            <el-input v-model="configs.blog.host_seo_name" />
          </el-form-item>
          <el-form-item label="SEO关键字">
            <el-input v-model="configs.blog.host_seo_keywords" />
          </el-form-item>
          <el-form-item label="SEO描述">
            <el-input v-model="configs.blog.host_seo_description" />
          </el-form-item>
          <el-form-item label="备案号">
            <el-input v-model="configs.blog.record" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('blog')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="小说配置">
        <el-form ref="form3" :model="configs.novel" label-width="100px">
          <el-form-item label="网站域名">
            <el-input v-model="configs.novel.host" />
          </el-form-item>
          <el-form-item label="网站wap域名">
            <el-input v-model="configs.novel.m_host" />
          </el-form-item>
          <el-form-item label="网站名称">
            <el-input v-model="configs.novel.host_name" />
          </el-form-item>
          <el-form-item label="SEO名称">
            <el-input v-model="configs.novel.host_seo_name" />
          </el-form-item>
          <el-form-item label="SEO关键字">
            <el-input v-model="configs.novel.host_seo_keywords" />
          </el-form-item>
          <el-form-item label="SEO描述">
            <el-input v-model="configs.novel.host_seo_description" />
          </el-form-item>
          <el-form-item label="备案号">
            <el-input v-model="configs.novel.record" />
          </el-form-item>
          <el-form-item label="说明">
            <el-input v-model="configs.novel.powerby" />
          </el-form-item>
          <el-form-item label="通知">
            <el-input v-model="configs.novel.notice" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('blog')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getConfigsApi, saveConfigsApi } from '@/api/config'

export default {
  name: 'Index',
  data() {
    return {
      configs: {
        system: {},
        blog: {},
        novel: {}
      },
      loading: false
    }
  },
  created() {
    this.getConfigs()
  },
  methods: {
    getConfigs() {
      this.loading = true
      getConfigsApi().then(response => {
        this.configs = response.data
      }).finally(() => {
        this.loading = false
      })
    },
    onSubmit(t) {
      this.loading = true
      saveConfigsApi({ type: t, data: this.configs[t] }).then(response => {
        this.$message.success('保存成功')
        this.getConfigs()
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
