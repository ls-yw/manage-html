<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" size="mini" type="primary" @click="addCategory">
        添加分类
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
      <el-table-column label="名称" prop="name" />
      <el-table-column label="seo title" prop="seo_name" />
      <el-table-column label="排序" prop="sort" align="center" width="60" />
      <el-table-column label="更新时间" prop="updated_at" align="center" width="160" />
      <el-table-column align="center" label="操作" width="210">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editHandle(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="delHandle(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :visible.sync="dialogEdit" :title="(editObj.id === 0 ? '添加' : '编辑')+'分类'" width="700px" center>
      <el-form ref="editObj" :rules="rules" :model="editObj" label-position="left" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editObj.name" />
        </el-form-item>
        <el-form-item label="seo标题" prop="seo_name">
          <el-input v-model="editObj.seo_name" />
        </el-form-item>
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="editObj.keyword" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editObj.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="editObj.sort" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCategory">保存</el-button>
        <el-button @click="dialogEdit=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { deleteNovelCategoryApi, getNovelCategoryListApi, saveNovelCategoryApi } from '@/api/novel/category' // secondary package based on el-pagination
export default {
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
      dialogEdit: false,
      editObj: {},
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getNovelCategoryListApi(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    addCategory() {
      this.categoryObjInit()
      this.dialogEdit = true
      this.$nextTick(() => {
        this.$refs['editObj'].clearValidate()
      })
    },
    categoryObjInit() {
      this.editObj = {
        id: 0,
        sort: 50
      }
    },
    editHandle(row) {
      this.editObj = Object.assign({}, row)
      this.dialogEdit = true
      this.$nextTick(() => {
        this.$refs['editObj'].clearValidate()
      })
    },
    delHandle(row) {
      this.$confirm('确定删除分类“' + row.name + '”？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteNovelCategoryApi({ id: row.id }).then(response => {
            if (response.code === 0) {
              this.getList()
              this.$message.success('删除成功')
            } else {
              this.$message.error(response.msg)
            }
          })
        })
        .catch(() => { })
    },
    saveCategory() {
      this.$refs.editObj.validate(valid => {
        if (valid) {
          saveNovelCategoryApi(this.editObj).then(response => {
            if (response.code === 0) {
              this.$message.success('保存成功')
              this.getList()
              this.dialogEdit = false
            } else {
              this.$message.error(response.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.filter-container{
    margin-bottom: 10px;
}
</style>
