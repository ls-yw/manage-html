<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" prop="id" width="60" />
      <el-table-column align="center" label="UID" prop="uid" width="60" />
      <el-table-column label="书名" prop="name" />
      <el-table-column label="作者" prop="author" />
      <el-table-column label="平台" prop="platform" align="center" width="80" />
      <el-table-column label="回复" prop="reply" />
      <el-table-column label="小说ID" prop="book_id" align="center" width="80" />
      <el-table-column label="创建时间" prop="created_at" align="center" width="160" />
      <el-table-column label="回复时间" prop="created_at" align="center" width="160" />
      <el-table-column align="center" label="操作" width="210" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleReply(scope.row)">
            回复
          </el-button>
          <el-button type="danger" size="mini" @click="handleDel(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog :visible.sync="dialogReply" title="收入申请回复" width="600px" center>
      <el-form ref="editForm" :rules="rules" :model="editObj" label-position="left" label-width="100px">
        <el-form-item label="小说ID" prop="book_id">
          <el-input v-model="editObj.book_id" />
        </el-form-item>
        <el-form-item label="回复内容" prop="reply">
          <el-input v-model="editObj.reply" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveReply">保存</el-button>
        <el-button @click="dialogReply=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deleteNovelBookApplyApi, getNovelBookApplyListApi, saveNovelBookApplyReplyApi } from '@/api/novel/book'
export default {
  name: 'Apply',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        size: 20
      },
      listLoading: true,
      dialogReply: false,
      editObj: {
        id: 0,
        book_id: 0,
        reply: ''
      },
      rules: {
        reply: [{ required: true, message: '回复内容不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getNovelBookApplyListApi(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    handleReply(row) {
      this.dialogReply = true
      this.editObj.id = row.id
      this.editObj.book_id = row.book_id
      this.editObj.reply = row.reply
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    handleSaveReply() {
      console.log(this.editObj)
      this.$refs.editForm.clearValidate()
      this.$refs.editForm.validate(valid => {
        if (valid) {
          saveNovelBookApplyReplyApi(this.editObj).then(response => {
            this.$message.success('保存成功')
            this.dialogReply = false
            this.getList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDel(row) {
      this.$confirm('确定删除收入申请ID：' + row.id + '？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteNovelBookApplyApi({ id: row.id }).then(response => {
            this.$message.success('删除成功')
            this.getList()
          })
        })
        .catch(() => { })
    }
  }
}
</script>

<style scoped>

</style>
