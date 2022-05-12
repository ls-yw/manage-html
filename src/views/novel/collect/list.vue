<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" size="mini" type="primary" @click="handleAdd">
        添加节点
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
      <el-table-column label="节点名称" prop="name" width="120" />
      <el-table-column label="目标网址" prop="host">
        <template slot-scope="scope">
          <a :href="scope.row.host " class="blue" target="_blank">{{ scope.row.host }}</a>
        </template></el-table-column>
      <el-table-column label="编码" prop="iconv" width="80" align="center" />
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.collect_status === 0 ? 'danger' : 'success'">{{ scope.row.collect_status_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updated_at" align="center" width="160" />
      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">
            测试
          </el-button>
          <el-button type="success" size="mini" @click="handleEdit(scope.row)">
            采集
          </el-button>
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
import { getNovelCollectListApi } from '@/api/novel/collect'

export default {
  name: 'List',
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
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        chapter_id: [{ required: true, message: '请选择章节', trigger: 'blur' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getNovelCollectListApi(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
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
