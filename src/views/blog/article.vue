<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" size="mini" type="primary" @click="$router.push('/blog/article/edit')">
        添加文章
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      class="list"
    >
      <el-table-column align="center" label="ID" prop="id" width="95" />
      <el-table-column label="标题" prop="title" />
      <el-table-column label="缩略图" width="110">
        <template slot-scope="scope">
          <el-image v-if="scope.row.img_url !==''" :src="scope.row.img_url" :preview-src-list="[scope.row.img_url]" class="thumb_img" />
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="sort" align="center" width="120">
        <template slot-scope="scope">
          {{ categoryPairs[scope.row.category_id] || '' }}
        </template>
      </el-table-column>
      <el-table-column label="点击" prop="clicks" align="center" width="60" />
      <el-table-column label="标签" align="center" width="80">
        <template slot-scope="scope">
          <el-tag v-for="(item,index) in scope.row.tags.split(',')" v-if="scope.row.tags !== ''" :key="index" size="mini">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" align="center" width="60" />
      <el-table-column label="状态" align="center" width="60">
        <template slot-scope="scope">
          <span :class="scope.row.is_deleted === 0 ? 'green' : 'red'">{{ scope.row.is_deleted === 0 ? '正常' : '删除' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="update_at" align="center" width="160" />
      <el-table-column align="center" label="操作" width="150">
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
  </div>
</template>

<script>
import { deleteBlogArticleApi, getBlogArticleListApi, recoveryBlogArticleApi } from '@/api/blog/article'
import Pagination from '@/components/Pagination'
import { getBlogCategoryPairsApi } from '@/api/blog/category'

export default {
  name: 'Article',
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      list: [],
      listQuery: {
        page: 1,
        size: 20
      },
      total: 0,
      categoryPairs: {}
    }
  },
  created() {
    this.getList()
    this.getPairs()
  },
  methods: {
    getList() {
      this.listLoading = true
      getBlogArticleListApi(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
      }).finally(() => {
        this.listLoading = false
      })
    },
    getPairs() {
      getBlogCategoryPairsApi().then(response => {
        this.categoryPairs[0] = '顶级分类'
        response.data.forEach(ele => {
          this.categoryPairs[ele.value] = ele.label
        })
      })
    },
    handleEdit(row) {
      this.$router.push({ path: '/blog/article/edit', query: { id: row.id }})
    },
    handleDel(row) {
      this.$confirm('确定删除文章“' + row.title + '”？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteBlogArticleApi({ id: row.id }).then(response => {
          this.$message.success('删除成功')
          this.getList()
        }).finally(() => {
          this.listLoading = false
        })
      })
    },
    handleRecovery(row) {
      recoveryBlogArticleApi({ id: row.id }).then(response => {
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

<style scoped lang="scss">
.filter-container{
    margin-bottom: 10px;
}
.thumb_img{
    width: 80px;
}
.list{
 .el-tag{
     margin-left: 10px;
     margin-bottom: 10px;
 }
}
</style>
