<template>
  <div class="app-container">
    <el-card v-loading="configsLoading" class="box-card">
      <div slot="header" class="clearfix">
        <span>系统设置</span>
      </div>
      <el-form ref="form" :rules="rules" :model="configsData" label-width="100px">
        <el-form-item label="域名" prop="host">
          <el-input v-model="configsData.host" />
        </el-form-item>
        <el-form-item label="WAP域名" prop="m_host">
          <el-input v-model="configsData.m_host" />
        </el-form-item>
        <el-form-item label="网站名" prop="host_name">
          <el-input v-model="configsData.host_name" />
        </el-form-item>
        <el-form-item label="SEO标题" prop="host_seo_name">
          <el-input v-model="configsData.host_seo_name" />
        </el-form-item>
        <el-form-item label="SEO关键字" prop="host_seo_keywords">
          <el-input v-model="configsData.host_seo_keywords" />
        </el-form-item>
        <el-form-item label="SEO简介" prop="host_seo_description">
          <el-input v-model="configsData.host_seo_description" type="textarea" />
        </el-form-item>
        <el-form-item label="底部说明" prop="powerby">
          <el-input v-model="configsData.powerby" />
        </el-form-item>
        <el-form-item label="备案号" prop="record">
          <el-input v-model="configsData.record" />
        </el-form-item>
        <el-form-item label="公告" prop="notice">
          <el-input v-model="configsData.notice" type="textarea" rows="5" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getNovelSettingApi, saveNovelSettingApi } from '@/api/novel/setting'

export default {
  name: 'Setting',
  data() {
    return {
      configsLoading: false,
      configsData: {},
      rules: {}
    }
  },
  created() {
    this.getConfigs()
  },
  methods: {
    getConfigs() {
      getNovelSettingApi().then(response => {
        this.configsData = response.data
      })
    },
    handleSave() {
      this.configsLoading = true
      saveNovelSettingApi(this.configsData).then(response => {
        this.getConfigs()
        this.configsLoading = false
      }).catch(() => {
        this.configsLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
