<template>
  <div class="app-container">
    <div class="filter-container">
      <!--      类型：
      <el-select v-model="listQuery.type" style="width: 90px" class="filter-item">
        <el-option v-for="item in searchTypes" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="listQuery.keyword" placeholder="请输入关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearch" />
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>-->
      <el-button class="filter-item" size="mini" type="primary" @click="handleAdd">
        添加
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" prop="id" width="95" />
      <el-table-column label="标题" prop="title" />
      <el-table-column label="所属章节" prop="chapter_name" width="80" align="center" />
      <el-table-column label="文章排序" prop="sort" width="80" align="center" />
      <el-table-column class-name="status-col" label="是否OSS" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_oss === 0 ? 'danger' : 'success'">{{ scope.row.is_oss_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updated_at" align="center" width="160" />
      <el-table-column align="center" label="操作" width="210">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDel(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
    <el-dialog :visible.sync="dialogEdit" :title="(editObj.id === 0 ? '添加章节' : '编辑'+'“'+editObj.title+'”')" width="800px" center>
      <el-form ref="editObj" :rules="rules" :model="editObj" label-position="left" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="editObj.title" />
        </el-form-item>
        <el-form-item label="所属章节" prop="chapter_id">
          <el-select v-model="editObj.chapter_id" placeholder="请选择">
            <el-option
              v-for="item in chapterPairs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="editObj.sort" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <ck-editor ref="editor" v-model="editObj.content" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="dialogEdit=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  deleteNovelArticleApi,
  getNovelArticleContentApi,
  getNovelArticleListApi,
  saveNovelArticleApi
} from '@/api/novel/article'
import Pagination from '@/components/Pagination'
import { getNovelChapterPairsApi } from '@/api/novel/book'
import CkEditor from '@/components/CkEditor'

export default {
  name: 'List',
  components: { CkEditor, Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        size: 20,
        bookId: this.$route.query.bookId
      },
      listLoading: true,
      dialogEdit: false,
      editObj: {},
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        chapter_id: [{ required: true, message: '请选择章节', trigger: 'blur' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      },
      chapterPairs: []
    }
  },
  created() {
    this.getChapterPairs()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getNovelArticleListApi(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
        this.list.map(ele => {
          if (this.chapterPairs.length > 0) {
            for (const index in this.chapterPairs) {
              if (this.chapterPairs[index]['value'] === ele.chapter_id) {
                ele.chapter_name = this.chapterPairs[index]['label']
              }
            }
          }
        })
      })
    },
    getChapterPairs() {
      getNovelChapterPairsApi(this.listQuery).then(response => {
        this.chapterPairs = response.data
      })
    },
    handleAdd() {
      this.initArticleObj()
      this.dialogEdit = true
    },
    handleEdit(row) {
      this.editObj = Object.assign({}, row)
      getNovelArticleContentApi({ articleId: row.id }).then(response => {
        if (response.code === 0) {
          this.editObj.content = response.data
          this.dialogEdit = true
          // this.$refs.tin.setContent(this.editObj.content)
          this.$nextTick(() => {
            this.$refs['editObj'].clearValidate()
          })
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    initArticleObj() {
      this.editObj = {
        id: 0,
        content: ''
      }
    },
    handleSave() {
      this.$refs.editObj.clearValidate()
      this.$refs.editObj.validate(valid => {
        if (valid) {
          saveNovelArticleApi(this.editObj).then(response => {
            if (response.code === 0) {
              this.$message.success('保存成功')
              this.dialogEdit = false
              this.getList()
            } else {
              this.$message.error(response.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDel(row) {
      this.$confirm('确定删除小说章节“' + row.title + '”？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteNovelArticleApi({ id: row.id }).then(response => {
            if (response.code === 0) {
              this.getList()
              this.$message.success('删除成功')
            } else {
              this.$message.error(response.msg)
            }
          })
        })
        .catch(() => { })
    }
  }
}
</script>

<style scoped>
.filter-container{
    margin-bottom: 10px;
}
</style>
<style lang="scss" >
.ck-editor__editable {
    max-height: 600px;
}
</style>
