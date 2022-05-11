<template>
  <div class="app-container">
    <div class="filter-container">
      类型：
      <el-select v-model="listQuery.type" style="width: 90px" class="filter-item">
        <el-option v-for="item in searchTypes" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="listQuery.keyword" placeholder="请输入关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearch" />
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
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
      <el-table-column label="封面" width="70">
        <template slot-scope="scope">
          <el-image
            style="width: 50px;"
            :src="scope.row.thumb_img"
            fit="fill"
          />
        </template>
      </el-table-column>
      <el-table-column label="书名" prop="name" />
      <el-table-column label="作者" prop="author" width="150" align="center" />
      <el-table-column label="章节数" width="80" align="center">
        <template slot-scope="scope">
          <router-link :to="'/novel/book/article?bookId='+scope.row.id" class="blue">{{ scope.row.articlenum }}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="浏览量" prop="click" width="80" align="center" />
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_finished === 0 ? 'danger' : 'success'">{{ scope.row.is_finished_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="采集ID" prop="collect_id" width="80" align="center" />
      <el-table-column label="来源ID" prop="from_collect_book_id" width="80" align="center" />
      <el-table-column label="质量" prop="quality" width="60" align="center" />
      <el-table-column label="采集时间" prop="last_collect_at" align="center" width="160" />
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

    <el-dialog :visible.sync="dialogEdit" :title="(editObj.id === 0 ? '添加' : '编辑')+editObj.name" width="700px" center>
      <el-form ref="editObj" :rules="rules" :model="editObj" label-position="left" label-width="70px">
        <el-form-item label="书名" prop="name">
          <el-input v-model="editObj.name" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="editObj.category" placeholder="请选择">
            <el-option
              v-for="item in categoryPairs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="editObj.author" />
        </el-form-item>
        <el-form-item label="状态" prop="is_finished">
          <el-radio v-model="editObj.is_finished" :label="0">连载</el-radio>
          <el-radio v-model="editObj.is_finished" :label="1">完结</el-radio>
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input v-model="editObj.intro" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item label="封面" prop="thumb_img">
          <upload-file :file-list-data.sync="thumb_img" project-type="novel" :limit="1" />
        </el-form-item>
        <el-form-item label="采集质量" prop="quality">
          <el-select v-model="editObj.quality" placeholder="请选择">
            <el-option
              v-for="index of 5"
              :key="index"
              :label="index"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="属性" prop="is_recommend">
          <el-checkbox v-model="editObj.is_recommend" :true-label="1">首页推荐</el-checkbox>
        </el-form-item>
        <el-form-item label="采集监控" prop="is_collect">
          <el-switch
            v-model="editObj.is_collect"
            active-text="开启"
            inactive-text="关闭"
            :active-value="1"
            :inactive-value="0"
          />
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
import Pagination from '@/components/Pagination'
import { deleteNovelBookApi, getNovelBookListApi, saveNovelBookApi } from '@/api/novel/book'
import { getNovelCategoryPairsApi } from '@/api/novel/category'
import UploadFile from '@/components/UploadFile'

export default {
  name: 'List',
  components: { Pagination, UploadFile },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        size: 10,
        type: 'name',
        keyword: ''
      },
      listLoading: true,
      dialogEdit: false,
      editObj: {},
      rules: {
        name: [{ required: true, message: '书名不能为空', trigger: 'blur' }],
        author: [{ required: true, message: '作者不能为空', trigger: 'blur' }]
      },
      thumb_img: [],
      categoryPairs: [],
      searchTypes: [
        {
          value: 'name',
          label: '书名'
        },
        {
          value: 'author',
          label: '作者'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getNovelBookListApi(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    handleEdit(row) {
      this.getCategoryPairs()
      this.editObj = Object.assign({}, row)
      this.thumb_img = [this.editObj.thumb_img]
      this.dialogEdit = true
      this.$nextTick(() => {
        this.$refs['editObj'].clearValidate()
      })
    },
    getCategoryPairs() {
      if (this.categoryPairs.length === 0) {
        getNovelCategoryPairsApi().then(response => {
          if (response.code === 0) {
            this.categoryPairs = response.data
          } else {
            this.$message.error(response.msg)
          }
        })
      }
    },
    handleSave() {
      this.editObj.thumb_img = this.thumb_img[0] || ''
      this.$refs.editObj.clearValidate()
      this.$refs.editObj.validate(valid => {
        if (valid) {
          saveNovelBookApi(this.editObj).then(response => {
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
      this.$confirm('确定删除小说“' + row.name + '”？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteNovelBookApi({ id: row.id }).then(response => {
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

<style scoped lang="scss">
.filter-container{
    margin-bottom: 10px;
    .filter-item{
        margin-right: 10px;
    }
}
</style>
