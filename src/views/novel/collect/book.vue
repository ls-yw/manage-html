<template>
  <div class="app-container">
    <div class="filter-container">
      是否采集：
      <el-select v-model="listQuery.isCollect" style="width: 90px" class="filter-item">
        <el-option v-for="item in searchTypes" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
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
      <el-table-column label="封面" width="70">
        <template slot-scope="scope">
          <el-image
            style="width: 50px;"
            :src="scope.row.thumb_img"
            fit="fill"
          />
        </template>
      </el-table-column>
      <el-table-column label="书名" prop="name" />
      <el-table-column label="作者" prop="author" width="150" />
      <el-table-column label="已采章节数" width="100" align="center">
        <template slot-scope="scope">
          <router-link :to="'/novel/book/article?bookId='+scope.row.id" class="blue">{{
            scope.row.articlenum
          }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="待采章节数" width="100" align="center">
        <template slot-scope="scope">
          <router-link :to="'/novel/collect/article?bookId='+scope.row.id+'&collectId='+scope.row.collect_id" class="blue">{{
            scope.row.waitArticleNum
          }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="待上传OSS数" width="110" align="center" prop="ossArticleNum" />
      <el-table-column class-name="status-col" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_finished === 0 ? 'danger' : 'success'">{{
            scope.row.is_finished_name
          }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="采集ID" prop="collect_id" width="80" align="center" />
      <el-table-column label="来源ID" prop="from_collect_book_id" width="80" align="center" />
      <el-table-column label="质量" prop="quality" width="60" align="center" />
      <el-table-column label="采集时间" prop="last_collect_at" align="center" width="160" />
      <el-table-column label="是否采集" prop="is_collect" align="center" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_collect" :active-value="1" :inactive-value="0" @change="handleCollectStatus(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="210" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.is_collect === 1" type="success" size="mini" @click="handleCollect(scope.row)">
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
import { changeNovelBookCollectApi, getNovelBookListApi } from '@/api/novel/book'

export default {
  name: 'Book',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        size: 10,
        isCollect: null
      },
      listLoading: true,
      categoryPairs: [],
      searchTypes: [
        {
          value: 1,
          label: '是'
        },
        {
          value: 0,
          label: '否'
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
      getNovelBookListApi(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    handleCollectStatus(row) {
      this.listLoading = true
      changeNovelBookCollectApi({ id: row.id, isCollect: row.is_collect }).then(response => {
        this.listLoading = false
      }).catch(() => {
        row.is_collect = row.is_collect === 1 ? 0 : 1
        this.listLoading = false
      })
    },
    handleCollect(row) {
      this.$router.push({ path: '/novel/collect/do', query: { bookId: row.id }})
    },
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
.filter-container {
    margin-bottom: 10px;

    .filter-item {
        margin-right: 10px;
    }
}
</style>
