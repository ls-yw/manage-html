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
      <el-table-column align="center" label="ID" prop="id" width="80" />
      <el-table-column label="搜索平台" prop="host" width="120" show-overflow-tooltip />
      <el-table-column label="关键词" prop="keyword" />
      <el-table-column label="目标平台" prop="domain" width="150" show-overflow-tooltip />
      <el-table-column label="ip" prop="ip" width="120" />
      <el-table-column label="IP位置" prop="ip_region" width="150" show-overflow-tooltip />
      <el-table-column label="地址" prop="param" width="200" show-overflow-tooltip />
      <el-table-column label="创建时间" prop="created_at" align="center" width="160" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getNovelDataSpiderListApi } from '@/api/novel/data'

export default {
  name: 'Book',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        size: 20,
        sort: '-id'
      },
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getNovelDataSpiderListApi(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
