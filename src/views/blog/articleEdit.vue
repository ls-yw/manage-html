<template>
  <div class="app-container">
    <el-card v-loading="loading" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id === 0 ? '新增' : '编辑' }}文章</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="$router.back()">返回</el-button>
      </div>
      <el-form ref="form" :rules="rules" :model="info" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="info.title" />
        </el-form-item>
        <el-form-item label="分类" prop="category_id">
          <el-select v-model="info.category_id" placeholder="请选择分类">
            <el-option
              v-for="item in categoryPairs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="缩略图">
          <upload-file :file-list-data.sync="thumbImgArr" project-type="novel" :limit="1" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="info.desc" type="textarea" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <ck-editor ref="editor" v-model="info.content" />
        </el-form-item>
        <el-form-item label="标签">
          <el-tag
            v-for="(item,index) in tagsArr"
            :key="index"
            class="tag"
            :disable-transitions="false"
            closable
            @close="handleCloseTag(index)"
          >{{ item }}</el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="handlerAddTag">+ 新增标签</el-button>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="info.sort" />
        </el-form-item>
        <el-form-item label="是否删除" prop="sort">
          <el-switch
            v-model="info.is_deleted"
            active-color="#ff4949"
            inactive-color="#13ce66"
            active-text="删除"
            inactive-text="正常"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getBlogArticleInfoApi, saveBlogArticleApi } from '@/api/blog/article'
import { getBlogCategoryPairsApi } from '@/api/blog/category'
import UploadFile from '@/components/UploadFile'
import CkEditor from '@/components/CkEditor'

export default {
  name: 'ArticleEdit',
  components: { CkEditor, UploadFile },
  data() {
    return {
      id: 0,
      info: {},
      loading: false,
      categoryPairs: [],
      inputVisible: false,
      inputValue: '',
      tagsArr: [],
      thumbImgArr: [],
      rules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
        content: [{ required: true, message: '请填写内容', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = parseInt(this.$route.query.id)
      this.getInfo()
    }
    this.getPairs()
  },
  methods: {
    getInfo() {
      getBlogArticleInfoApi({ id: this.id }).then(response => {
        this.info = response.data
        this.thumbImgArr = this.info.img_url === '' ? [] : [this.info.img_url]
        if (this.info.tags !== '') {
          this.tagsArr = this.info.tags.split(',')
        }
      })
    },
    getPairs() {
      getBlogCategoryPairsApi({ pid: 0 }).then(response => {
        this.categoryPairs = response.data
        this.categoryPairs.unshift({ 'label': '顶级分类', 'value': 0 })
      })
    },
    handleCloseTag(index) {
      this.tagsArr.splice(index, 1)
    },
    handlerAddTag() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.tagsArr.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    onSubmit() {
      console.log(this.info)
      this.info.img_url = this.thumbImgArr.length > 0 ? this.thumbImgArr[0] : ''
      this.info.tags = this.tagsArr.length > 0 ? this.tagsArr.join(',') : ''
      this.$refs.form.clearValidate()
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          saveBlogArticleApi(this.info).then(response => {
            this.$message.success('保存成功')
            this.$router.push('/blog/article/list')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
