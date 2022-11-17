<template>
  <div class="app-container">
    <div class="filter-container">
      状态：
      <el-select v-model="listQuery.collectStatus" style="width: 90px" class="filter-item" @change="getList">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
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
      <el-table-column label="节点名称" prop="name" width="150" />
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
          <el-button size="mini" @click="handleTest(scope.row)">
            测试
          </el-button>
          <el-button v-if="scope.row.collect_status === 1" type="success" size="mini" @click="handleCollect(scope.row)">
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

    <el-dialog
      title="开始采集"
      :visible.sync="collectDialog"
      width="30%"
    >
      <el-form ref="form" :rules="rules" :model="startCollectObj" label-width="100px">
        <el-form-item label="来源小说ID" prop="fromBookId">
          <el-input v-model="startCollectObj.fromBookId" placeholder="请输入来源小说ID" />
        </el-form-item>
        <el-form-item>
          <el-button v-loading.fullscreen.lock="collectInfoLoading" type="primary" @click="handleCollectInfo">采集基本信息</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="采集小说详情"
      :visible.sync="collectBookDialog"
      width="50%"
    >
      <el-form ref="infoForm" :rules="bookRules" :model="collectBook" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="collectBook.name" placeholder="请输入小说名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="collectBook.category" placeholder="请选择">
            <el-option
              v-for="item in categoryPairs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          {{ collectBook.category_name }}
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="collectBook.author" placeholder="请输入小说作者" />
        </el-form-item>
        <el-form-item label="状态" prop="finished">
          <el-radio-group v-model="collectBook.finished">
            <el-radio :label="1">完本</el-radio>
            <el-radio :label="0">连载</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input v-model="collectBook.intro" placeholder="请输入小说简介" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="封面" prop="thumb_img">
          <el-col :span="18">
            <el-input v-model="collectBook.thumb_img" placeholder="请输入小说封面" />
            {{ collectBook.thumb_img }}
          </el-col>
          <el-col :span="6" class="text-center">
            <el-image
              style="width: 90px;"
              :src="collectBook.thumb_img"
              :preview-src-list="[collectBook.thumb_img]"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="监控采集" prop="is_collect">
          <el-radio-group v-model="collectBook.is_collect">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="text-center">
          <el-button v-loading.fullsreen.lock="saveCollectInfoLoading" type="primary" @click="handleSaveCollectInfo">保存</el-button>
          <el-button v-loading.fullsreen.lock="saveCollectInfoLoading" type="success" @click="handleSaveCollectInfo('goOn')">保存并继续采集</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  deleteNovelCollectApi,
  getNovelCollectListApi,
  getNovelStartCollectInfoApi,
  saveNovelStartCollectInfoApi
} from '@/api/novel/collect'
import { getNovelCategoryPairsApi } from '@/api/novel/category'

export default {
  name: 'List',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        size: 20,
        collectStatus: 1
      },
      listLoading: true,
      editObj: {},
      collectDialog: false,
      startCollectObj: {
        fromBookId: ''
      },
      rules: {
        fromBookId: [{ required: true, message: '请输入来源小说ID', trigger: 'blur' }]
      },
      bookRules: {
        name: [{ required: true, message: '请输入小说名称', trigger: 'blur' }],
        category: [{ required: true, message: '请选择小说分类', trigger: 'change' }],
        author: [{ required: true, message: '请输入小说作者', trigger: 'blur' }],
        is_collect: [{ required: true, message: '请选择是否监控采集', trigger: 'change' }],
        finished: [{ required: true, message: '请选择小说状态', trigger: 'change' }]
      },
      collectBook: {},
      collectBookDialog: false,
      collectInfoLoading: false,
      saveCollectInfoLoading: false,
      categoryPairs: [],
      statusOptions: [
        {
          value: 99,
          label: '全部'
        },
        {
          value: 1,
          label: '可采集'
        },
        {
          value: 0,
          label: '不可采集'
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
      getNovelCollectListApi(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    handleTest(row) {
      this.$router.push({ path: '/novel/collect/test', query: { collectId: row.id, name: row.name, host: row.host }})
    },
    handleEdit(row) {
      this.$router.push({ path: '/novel/collect/edit', query: { id: row.id, name: row.name }})
    },
    handleAdd() {
      this.$router.push({ path: '/novel/collect/edit', query: { id: 0, name: '' }})
    },
    handleDel(row) {
      this.$confirm('确定删除采集节点“' + row.name + '”？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.listLoading = true
        deleteNovelCollectApi({ id: row.id }).then(response => {
          this.getList()
          this.$message.success('删除成功')
          this.listLoading = false
        }).catch(() => { this.listLoading = false })
      })
    },
    handleCollect(row) {
      this.startCollectObj.collectId = row.id
      this.startCollectObj.fromBookId = ''
      this.collectDialog = true
    },
    handleCollectInfo() {
      this.getCategoryPairs()
      this.$refs.form.validate(valid => {
        if (valid) {
          this.collectInfoLoading = true
          getNovelStartCollectInfoApi(this.startCollectObj).then(response => {
            this.collectDialog = false
            this.collectBook = response.data
            this.collectBook.collect_id = this.startCollectObj.collectId
            this.collectBook.from_collect_book_id = this.startCollectObj.fromBookId
            this.collectBookDialog = true
          }).finally(() => { this.collectInfoLoading = false })
        }
      })
    },
    handleSaveCollectInfo(act) {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.saveCollectInfoLoading = true
          saveNovelStartCollectInfoApi(this.collectBook).then(response => {
            this.collectBookDialog = false
            if (act === 'goOn') {
              const bookId = response.data
              this.$router.push({ path: '/novel/collect/do', query: { bookId: bookId }})
            } else {
              this.$message.success('保存成功')
              this.collectBookDialog = false
            }
          }).finally(() => {
            this.saveCollectInfoLoading = false
          })
        }
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
    }
  }
}
</script>

<style scoped lang="scss">
.filter-container{
    margin-bottom: 10px;
    .filter-item {
        margin-right: 10px;
    }
}
</style>
