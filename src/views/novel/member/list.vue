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
      <el-table-column label="手机号码" prop="mobile" width="110" />
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="最后登录IP" prop="last_ip" align="center" />
      <el-table-column label="最后登录IP" prop="ip_region" align="center" />
      <el-table-column label="最后登录时间" prop="last_time" align="center" />
      <el-table-column label="登录次数" prop="count" align="center" />
      <el-table-column label="注册时间" prop="created_at" align="center" width="160" />
      <el-table-column align="center" label="操作" width="210" fixed="right">
        <!--        <template slot-scope="scope">-->
        <!--          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">-->
        <!--            编辑-->
        <!--          </el-button>-->
        <!--          <el-button type="danger" size="mini" @click="handleDel(scope.row)">-->
        <!--            删除-->
        <!--          </el-button>-->
        <!--        </template>-->
      </el-table-column>
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
import { getNovelMemberListApi } from '@/api/novel/member'

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
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getNovelMemberListApi(this.listQuery).then(response => {
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
