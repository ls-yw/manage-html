<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit

      highlight-current-row
      @sort-change="sortList"
    >
      <el-table-column align="center" label="ID" prop="id" width="60" />
      <el-table-column label="搜索关键词" prop="keyword" />
      <el-table-column label="次数" prop="num" width="80" sortable="custom" />
      <el-table-column label="平台" prop="platform" width="60" />
      <el-table-column label="创建时间" prop="created_at" align="center" width="160" />
      <el-table-column label="更新时间" prop="created_at" align="center" width="160" />
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
import { getNovelDataSearchListApi } from '@/api/novel/data'

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
      getNovelDataSearchListApi(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    sortList(order) {
      this.listQuery.sort = (order.order !== null ? ((order.order === 'descending' ? '-' : '') + order.prop) : '-id')
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
