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
      <el-button class="filter-item" size="mini" type="success" @click="handleBatchCollected">
        已采集
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="ID" prop="id" width="95" />
      <el-table-column align="center" label="小说ID" prop="book_id" width="95" />
      <el-table-column label="标题" prop="from_title" />
      <el-table-column label="排序" prop="from_sort" width="80" align="center" />
      <el-table-column class-name="status-col" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.from_status === 0 ? 'danger' : 'success'">{{ scope.row.from_status_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="目标网址" prop="from_url" width="200" align="center" show-overflow-tooltip />
      <el-table-column label="文章内容地址" prop="url" width="150" align="center" show-overflow-tooltip />
      <el-table-column label="创建时间" prop="created_at" align="center" width="160" />
      <el-table-column label="更新时间" prop="updated_at" align="center" width="160" />
      <el-table-column align="center" label="操作" width="210">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleCollected(scope.row)">
            已采集
          </el-button>
          <el-button type="primary" size="mini" @click="handleAdd(scope.row)">
            添加
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
          <tinymce ref="tin" v-model="editObj.content" />
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
import { confirmNovelCollectArticleApi, getNovelCollectArticleListApi } from '@/api/novel/collect'

export default {
  name: 'Article',
  components: { Pagination },
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
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getNovelCollectArticleListApi(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    handleBatchCollected() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请先选择要确认的章节')
        return false
      }
      this.$confirm('确定修改已采集', '已采集确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const ids = []
          this.multipleSelection.forEach(ele => {
            ids.push(ele.id)
          })
          confirmNovelCollectArticleApi({ id: ids }).then(response => {
            this.getList()
            this.$message.success('设置成功')
          })
        })
        .catch(() => { })
    },
    handleCollected(row) {
      this.multipleSelection = []
      this.multipleSelection.push(row)
      this.handleBatchCollected()
    }
  }
}
</script>

<style scoped>
.filter-container{
    margin-bottom: 10px;
}
</style>
