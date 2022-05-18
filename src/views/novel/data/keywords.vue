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
      <el-table-column label="书名" prop="book.name" />
      <el-table-column label="章节" prop="article.title" />
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
import { getNovelMemberBookListApi } from '@/api/novel/member'

export default {
  name: 'Book',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        size: 20
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
      getNovelMemberBookListApi(this.listQuery).then(response => {
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
