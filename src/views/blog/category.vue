<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" size="mini" type="primary" @click="editObj={};dialogEdit=true">
        添加分类
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="id"
      default-expand-all
      element-loading-text="Loading"
      border
      fit
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      highlight-current-row
    >
      <el-table-column align="center" label="ID" prop="id" width="95" />
      <el-table-column label="名称" prop="name" />
      <el-table-column label="状态" align="center" width="60">
        <template slot-scope="scope">
          <span :class="scope.row.is_deleted === 0 ? 'green' : 'red'">{{ scope.row.is_deleted === 0 ? '正常' : '删除' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="update_at" align="center" width="160" />
      <el-table-column align="center" label="操作" width="210">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button v-if="scope.row.is_deleted === 0" type="danger" size="mini" @click="handleDel(scope.row)">
            删除
          </el-button>
          <el-button v-if="scope.row.is_deleted === 1" type="warning" size="mini" @click="handleRecovery(scope.row)">
            恢复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogEdit" :title="(editObj.id && editObj.id !== 0 ? '编辑' : '添加')+'分类'" width="700px" center @close="closeDialog">
      <el-form ref="editObj" :rules="rules" :model="editObj" label-position="left" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editObj.name" />
        </el-form-item>
        <el-form-item label="父级分类" prop="pid">
          <el-select v-model="editObj.pid" placeholder="请选择父级分类">
            <el-option
              v-for="item in categoryPairs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否删除" prop="sort">
          <el-switch
            v-model="editObj.is_deleted"
            active-color="#ff4949"
            inactive-color="#13ce66"
            active-text="删除"
            inactive-text="正常"
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
import {
  deleteBlogCategoryApi,
  getBlogCategoryListApi,
  getBlogCategoryPairsApi, recoveryBlogCategoryApi,
  saveBlogCategoryApi
} from '@/api/blog/category'

export default {
  name: 'Category',
  data() {
    return {
      list: [],
      editObj: {},
      listLoading: false,
      dialogEdit: false,
      categoryPairs: [],
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        pid: [{ required: true, message: '父级分类不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getPairs()
  },
  methods: {
    getList() {
      this.listLoading = true
      getBlogCategoryListApi().then(response => {
        this.list = []
        response.data.forEach(ele => {
          if (ele.pid === 0) {
            this.list.push(ele)
          } else {
            this.list.forEach(e => {
              if (e.id === ele.pid) {
                if (!e.children) {
                  e.children = []
                }
                e.children.push(ele)
              }
            })
          }
        })
      }).finally(() => {
        this.listLoading = false
      })
    },
    getPairs() {
      getBlogCategoryPairsApi({ pid: 0 }).then(response => {
        this.categoryPairs = response.data
        this.categoryPairs.unshift({ 'label': '顶级分类', 'value': 0 })
      })
    },
    handleEdit(row) {
      this.dialogEdit = true
      this.editObj = JSON.parse(JSON.stringify(row))
    },
    handleSave() {
      this.$refs.editObj.validate(valid => {
        if (valid) {
          this.listLoading = true
          saveBlogCategoryApi(this.editObj).then(response => {
            this.$message.success('保存成功')
            this.dialogEdit = false
            this.getList()
          }).finally(() => {
            this.listLoading = false
          })
        }
      })
    },
    handleDel(row) {
      this.$confirm('确定删除分类“' + row.name + '”？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteBlogCategoryApi({ id: row.id }).then(response => {
          this.$message.success('删除成功')
          this.getList()
        }).finally(() => {
          this.listLoading = false
        })
      })
    },
    handleRecovery(row) {
      recoveryBlogCategoryApi({ id: row.id }).then(response => {
        this.$message.success('恢复成功')
        this.getList()
      }).finally(() => {
        this.listLoading = false
      })
    },
    closeDialog() {
      this.$refs.editObj.clearValidate()
    }
  }
}
</script>

<style scoped>
.filter-container{
    margin-bottom: 10px;
}
</style>
