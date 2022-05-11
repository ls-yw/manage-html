<template>
  <div>
    <div v-for="(img,key) in fileList" :key="key" class="image-preview">
      <video v-if="uploadType === 'video'" controls="controls" :src="img.url" height="100%" width="128px" />
      <el-image v-else :src="img.url" :preview-src-list="fileListData" />
      <i class="el-icon-close" @click="delImage(key)" />
    </div>
    <el-upload
      v-if="fileListData.length < limit"
      ref="uploadFile"
      :action="url"
      list-type="picture-card"
      :data="dataParams"
      :on-error="handleUploadError"
      :on-success="handleUploadSuccess"
      :file-list="fileList"
      :on-change="handleChange"
      :headers="headers"
      :show-file-list="false"
      style="float: left"
      :limit="limit"
      :on-exceed="handleExceed"
    >
      <i slot="default" class="el-icon-plus" />
    </el-upload>
  </div>
</template>

<script>

import { getToken } from '@/utils/auth'

export default {
  name: 'UploadFile',
  props: {
    width: {
      type: Number,
      default: 100
    },
    uploadType: {
      type: String,
      default: 'image'
    },
    projectType: {
      type: String,
      default: ''
    },
    fileListData: {
      type: Array,
      default() {
        return []
      }
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      url: '/upload',
      dataParams: {
        type: this.uploadType
      },
      headers: {
        token: getToken()
      },
      tmpFileList: this.fileListData
    }
  },
  computed: {
    fileList: {
      get() {
        const tmp = []
        if (this.fileListData.length > 0) {
          for (const i in this.fileListData) {
            tmp.push({ name: '', url: this.fileListData[i] })
          }
        }
        return tmp
      }
    }
  },
  created() {
    this.url = process.env.VUE_APP_BASE_API + '/upload?type=' + this.projectType
  },
  methods: {
    handleUploadSuccess(res, file, fileList) {
      if (typeof (res.code) === 'undefined') {
        this.$message.error('上传失败')
        this.$refs.uploadFile.uploadFiles.splice(this.$refs.uploadFile.uploadFiles.indexOf(res), 1)
      } else if (res.code !== 0) {
        console.log(this.fileList, '!=0')
        this.$message.error(res.msg)
        this.$refs.uploadFile.uploadFiles.splice(this.$refs.uploadFile.uploadFiles.indexOf(res), 1)
      } else {
        this.tmpFileList.push(res.data)
        this.$emit('update:fileListData', this.tmpFileList)
        this.tmpLimit = this.tmpLimit + 1
        this.imageUrl = URL.createObjectURL(file.raw)
      }
      console.log(file, 'success')
      console.log(fileList, 'success')
    },
    handleUploadError(err, file, fileList) {
      console.log(err, 'error')
      console.log(file, 'error')
      console.log(fileList, 'error')
    },
    handleChange(file, fileList) {
      // console.log(this.fileList, 'handleChange')
      // console.log(file, 'handleChange')
    },
    delImage(index) {
      this.tmpFileList.splice(index, 1)
      this.$emit('update:fileListData', this.tmpFileList)
      this.tmpLimit = this.tmpLimit - 1
    },
    handleExceed(files, fileList) {
      const diff = this.limit - this.fileListData.length
      this.$message.error('还能上传' + diff + '个文件')
      console.log(files, 'handleExceed')
      console.log(fileList, 'handleExceed')
    }
  }
}
</script>

<style scoped lang="scss">
.image-preview{
  width: 148px;
  height: 148px;
  margin-right: 10px;
  margin-bottom: 10px;
  float: left;
  position: relative;
  .el-image{
    width: 148px;
    height: 148px;
  }
  i{
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    border: 1px solid #000000;
    background: #ffffff;
  }
}
</style>
