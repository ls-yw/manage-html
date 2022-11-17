<template>
  <div class="app-container">
    <el-card v-loading="loading" class="box-card">
      <div slot="header" class="clearfix">
        <span>搜索</span>
      </div>
      <el-form ref="form" :rules="rules" :inline="true" :model="searchObj" label-width="100px">
        <el-form-item label="采集类型" prop="source">
          <el-select v-model="searchObj.source" placeholder="活动区域">
            <el-option label="旧版看书神器" value="jbzssq" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="searchObj.keyword" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="search-list">
        <div v-for="(item,index) in list" :key="index" class="item">
          <el-row>
            <el-col :span="4" class="thumb-img">
              <el-image :src="item.thumb_img" fit="scale-down" />
            </el-col>
            <el-col :span="18" class="info">
              <div class="id"><label>ID：</label>{{ item.id }}</div>
              <div class="title"><label>书名：</label>{{ item.name }}</div>
              <div class="author"><label>作者：</label>{{ item.author }}</div>
              <div class="status"><label>状态：</label>{{ item.status }}</div>
              <div class="category_name"><label>分类：</label>{{ item.category_name }}</div>
              <div class="last-article"><label>最新章节：</label>{{ item.last_article }}</div>
              <div class="last-time"><label>更新时间：</label>{{ item.last_time }}</div>
              <div class="desc"><label>简介：</label>{{ item.desc }}</div>
            </el-col>
            <el-col :span="2" class="handle">
              <el-button type="success" @click="goCollect(item)">采集</el-button>
              <el-button type="primary" @click="handleLook(item)">查看</el-button>
            </el-col>
          </el-row>
          <el-divider />
        </div>
      </div>
    </el-card>
    <el-dialog
      :title="waitCollectBookInfo.name"
      :visible.sync="dialogConfirmInfo"
      width="30%"
      class="confirm-info"
    >
      <el-descriptions :column="1">
        <el-descriptions-item label="ID">{{ waitCollectBookInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="书名">{{ waitCollectBookInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="作者">{{ waitCollectBookInfo.author }}</el-descriptions-item>
        <el-descriptions-item label="分类">
          <el-select v-model="waitCollectBookInfo.category" placeholder="请选择">
            <el-option
              v-for="item in categoryPairs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>&nbsp;
          {{ waitCollectBookInfo.category_name }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">{{ waitCollectBookInfo.status }}</el-descriptions-item>
        <el-descriptions-item label="简介">{{ waitCollectBookInfo.desc }}</el-descriptions-item>
      </el-descriptions>
      <div class="btn">
        <el-button type="success" @click="confirmCollect">确定采集</el-button>
        <el-button @click="dialogConfirmInfo = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-loading="dialogInfoLoading"
      title="章节列表"
      :visible.sync="dialogInfo"
      width="80%"
    >
      <div class="info-box">
        <div class="list">
          <div v-for="(item,index) in lookList" :key="index">
            <div class="dt">{{ item.name }}</div>
            <ul>
              <li v-for="(it,i) in item.list" :key="i" @click="lookArticle(item.bookId, it.id)">{{ it.name }}</li>
            </ul>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-loading="dialogInfoContentLoading"
      title="文章内容"
      :visible.sync="dialogInfoContent"
      width="60%"
    >
      <el-form ref="form" label-width="150px" class="info-content-box">
        <el-form-item v-for="(item,index) in lookContent" :key="index" :class="index" :label="index">
          {{ item }}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getNovelAppCollectApi,
  getNovelAppCollectSearchApi,
  getNovelAppCollectCheckApi,
  getNovelAppCollectLookApi, getNovelAppCollectLookContentApi
} from '@/api/novel/appCollect'
import { getNovelCategoryPairsApi } from '@/api/novel/category'

export default {
  name: 'App',
  data() {
    return {
      searchObj: {
        source: 'jbzssq',
        keyword: '夜的命名术'
      },
      rules: {
        keyword: [{ required: true, message: '请填写搜索关键字', trigger: 'blur' }]
      },
      list: [],
      loading: false,
      dialogConfirmInfo: false,
      dialogInfo: false,
      waitCollectBookInfo: {
        category: 0
      },
      categoryPairs: [],
      dialogInfoLoading: false,
      dialogInfoContentLoading: false,
      dialogInfoContent: false,
      lookList: [],
      lookContent: {}
    }
  },
  created() {
    this.getCategoryPairs()
  },
  methods: {
    goSearch() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          getNovelAppCollectSearchApi(this.searchObj).then(response => {
            this.list = response.data
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    goCollect(row) {
      this.loading = true
      getNovelAppCollectCheckApi({ source: this.searchObj.source, name: row.name, author: row.author }).then(response => {
        this.waitCollectBookInfo = row
        this.dialogConfirmInfo = true
      }).finally(() => {
        this.loading = false
      })
    },
    getCategoryPairs() {
      if (this.categoryPairs.length === 0) {
        getNovelCategoryPairsApi().then(response => {
          this.categoryPairs = response.data
        })
      }
    },
    confirmCollect() {
      this.loading = true
      getNovelAppCollectApi({ source: this.searchObj.source, ...this.waitCollectBookInfo }).then(response => {
        this.$router.push({ path: '/novel/collect/do', query: { bookId: response.data }})
      }).finally(() => {
        this.loading = false
      })
    },
    handleLook(row) {
      this.dialogInfo = true
      this.dialogInfoLoading = true
      getNovelAppCollectLookApi({ source: this.searchObj.source, id: row.id }).then(response => {
        this.lookList = response.data
      }).finally(() => {
        this.dialogInfoLoading = false
      })
    },
    lookArticle(bookId, articleId) {
      this.dialogInfoContent = true
      this.dialogInfoContentLoading = true
      getNovelAppCollectLookContentApi({ source: this.searchObj.source, bookId, articleId }).then(response => {
        this.lookContent = response.data
      }).finally(() => {
        this.dialogInfoContentLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.app-container {
    .box-card {
        .search-list {
            .item {
                .thumb-img {
                    text-align: center;

                    img {
                        width: 200px;
                    }
                }

                .info {
                    font-size: 14px;
                    line-height: 24px;

                    label {
                        font-weight: normal;
                        font-size: 14px;
                        color: #999999;
                        width: 80px;
                        display: inline-block;
                        text-align: right;
                    }

                    .title {
                        font-weight: bold;
                    }
                }

                .handle {
                    text-align: center;
                    button{
                        margin-top: 10px;
                        margin-left: 0;
                    }
                }
            }
        }
    }
    .confirm-info{
        line-height: 30px;
        .btn{
            text-align: center;
            padding: 10px 0;
        }
    }
    .info-box{
        .list{
            .dt{
                font-weight: bold;
            }
            ul{
                max-height: 600px;
                overflow-y: auto;
                li{
                    display: inline-block;
                    line-height: 26px;
                    min-width: 300px;
                    cursor: pointer;
                    //padding-right: 50px;
                }
            }
        }
    }
    .info-content-box{
        .content{
            max-height: 600px;
            overflow-y: auto;
        }
    }
}
</style>
