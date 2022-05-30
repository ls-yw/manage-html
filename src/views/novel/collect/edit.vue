<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>规则</span>
      </div>
      <div class="text item orange">
        <p>系统默认变量：&lt;{articleid}&gt; - 文章序号，&lt;{chapterid}&gt; － 章节序号， &lt;{subarticleid}&gt; － 文章子序号，
          &lt;{subchapterid}&gt; － 章节子序号。</p>

        <p>系统标签 * 可以替代任意字符串。</p>

        <p>系统标签 ! 可以替代除了&lt;和&gt;以外的任意字符串。</p>

        <p>系统标签 ~ 可以替代除了&lt;&gt;'"以外的任意字符串。</p>

        <p>系统标签 ^ 可以替代除了数字和&lt;&gt;之外字符串。</p>

        <p>系统标签 $ 可以替代数字字符串。</p>

        <p>空格 & nbsp; 可使用@代替</p>

        <p>采集规则中，需要获取的内容部分用四个以上系统标签代替，如 !!!!</p>
      </div>
    </el-card>
    <el-form ref="form" :rules="rules" :model="collectObj" label-width="150px">
      <el-card v-loading="formLoading" class="box-card">
        <div slot="header" class="clearfix">
          <span class="title">{{ collectId===0?'新增':'编辑' }}采集节点“{{ $route.query.name||'' }}”</span>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="collectObj.name" placeholder="请输入节点名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标网址" prop="host">
              <el-input v-model="collectObj.host" placeholder="请输入目标网址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="章节子序号运算方式" prop="rules.sub_book_id">
              <el-col :span="12"><el-input v-model="collectObj.rules.sub_book_id" placeholder="请输入章节子序号运算方式" /></el-col>
              <el-col :span="12" class="text-center">&lt;{subBookId}&gt;</el-col>
              <el-col :span="24" class="orange">支持使用&lt;{bookId}&gt; 标记的四则运算（+加，-减，*乘，/除，%取余，%%取整）<br>
                <span class="red">暂只支持一步运算</span></el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="可否采集" prop="collect_status">
              <el-radio-group v-model="collectObj.collect_status">
                <el-radio :label="1">可采集</el-radio>
                <el-radio :label="0">不可采集</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标网站编码" prop="iconv">
              <el-radio-group v-model="collectObj.iconv">
                <el-radio label="UTF-8" />
                <el-radio label="GBK" />
                <el-radio label="G2312" />
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card v-loading="formLoading" class="box-card">
        <div slot="header" class="clearfix">
          <span>小说信息页面采集规则</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="小说信息页面地址" prop="rules.book_url">
              <el-input v-model="collectObj.rules.book_url" placeholder="请输入小说信息页面地址" />
              <p class="note">例：https://www.x23us.com/book/&lt;{bookId}&gt;</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="小说名称采集规则" prop="rules.name">
              <el-input v-model="collectObj.rules.name" placeholder="请输入小说名称采集规则" type="textarea" :rows="4" />
              <p class="note">例：&lt;dd&gt;&lt;h1&gt;!!!! 全文阅读&lt;/h1&gt;&lt;/dd&gt;</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者采集规则" prop="rules.author">
              <el-input v-model="collectObj.rules.author" placeholder="请输入作者采集规则" type="textarea" :rows="4" />
              <p class="note">例：&lt;th&gt;文章作者&lt;/th&gt;&lt;td&gt;@!!!!&lt;/td&gt;</p>
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="小说类型采集规则" prop="rules.category">
              <el-input v-model="collectObj.rules.category" placeholder="请输入小说类型采集规则" type="textarea" :rows="4" />
              <p class="note">例：&lt;a href="/class/$_$.html"&gt;!!!!&lt;/a&gt;</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小说类型对应关系" prop="">
              <!--              <el-input v-model="collectObj.host" placeholder="请输入小说类型对应关系" type="textarea" :rows="4" />-->
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="简介采集规则" prop="rules.intro">
              <el-input v-model="collectObj.rules.intro" placeholder="请输入简介采集规则" type="textarea" :rows="4" />
              <p class="note">例：&lt;p&gt;****&lt;/p&gt;&lt;p style="display:none" id="sidename"&gt;</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="全文标记采集规则" prop="rules.finished">
              <el-input v-model="collectObj.rules.finished" placeholder="请输入全文标记采集规则" type="textarea" :rows="4" />
              <p class="note">例：&lt;th&gt;文章状态&lt;/th&gt;&lt;td&gt;@已完成&lt;/td&gt;&lt;/tr&gt;</p>
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="封面图片采集规则" prop="rules.thumb_img">
              <el-input v-model="collectObj.rules.thumb_img" placeholder="请输入封面图片采集规则" type="textarea" :rows="4" />
              <p class="note">例：&lt;img style="padding:7px; border:1px solid #E4E4E4; width:120px; height:150px; margin:0 25px 0 15px;" alt="!" src="!!!!"/&gt;</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过滤的封面图片" prop="rules.filter_thimb_img">
              <el-input v-model="collectObj.rules.filter_thimb_img" placeholder="请输入过滤的封面图片" />
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
      </el-card>

      <el-card v-loading="formLoading" class="box-card">
        <div slot="header" class="clearfix">
          <span>小说目录页面采集规则</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="小说目录页面地址" prop="rules.chapter_url">
              <el-input v-model="collectObj.rules.chapter_url" placeholder="请输入小说目录页面地址" :rows="4" />
              <p class="note">例：https://www.x23us.com/html/&lt;{subBookId}&gt;/&lt;{bookId}&gt;/</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="章节名称采集规则" prop="rules.article_title">
              <el-input v-model="collectObj.rules.article_title" placeholder="请输入章节名称采集规则" type="textarea" :rows="4" />
              <p class="note">例：&lt;td class="L"&gt;&lt;a href="$.html"&gt;!!!!&lt;/a&gt;&lt;/td&gt;</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="章节序号采集规则" prop="rules.article_id">
              <el-input v-model="collectObj.rules.article_id" placeholder="请输入章节序号采集规则" type="textarea" :rows="4" />
              <p class="note">例：&lt;td class="L"&gt;&lt;a href="$$$$.html"&gt;!&lt;/a&gt;&lt;/td&gt;</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card v-loading="formLoading" class="box-card">
        <div slot="header" class="clearfix">
          <span>章节内容页面采集规则</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="章节内容页面地址" prop="rules.article_url">
              <el-input v-model="collectObj.rules.article_url" placeholder="请输入章节内容页面地址" :rows="4" />
              <p class="note">例：https://www.x23us.com/html/&lt;{subBookId}&gt;/&lt;{bookId}&gt;/&lt;{articleId}&gt;.html</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="章节内容采集规则" prop="rules.content">
              <el-input v-model="collectObj.rules.content" placeholder="请输入章节内容采集规则" type="textarea" :rows="4" />
              <p class="note">例：&lt;/p&gt;&lt;dd id="contents"&gt;****&lt;/dd&gt;&lt;div class="adhtml"&gt;&lt;script&gt;show_htm2();&lt;/script&gt;&lt;/div&gt;</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内容替换规则">
              <el-col :span="11">
                <el-input v-model="collectObj.rules.content_filter" placeholder="请输入章节内容过滤规则" type="textarea" :rows="4" />
                <p class="note">例：顶点|x23us</p>
              </el-col>
              <el-col :span="2" class="text-center">-</el-col>
              <el-col :span="11">
                <el-input v-model="collectObj.rules.content_replace" placeholder="请输入章节内容替换规则" type="textarea" :rows="4" />
                <p class="note">例：woodlsy|woodlsy</p>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card v-loading="formLoading" class="box-card">
        <div class="text-center">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { getNovelCollectInfoApi, saveNovelCollectApi } from '@/api/novel/collect'

export default {
  name: 'Edit',
  data() {
    return {
      formLoading: false,
      collectObj: {
        collect_status: 1,
        iconv: 'GBK',
        rules: {}
      },
      collectId: 0,
      rules: {
        name: [{ required: true, message: '请填写采集节点名称', trigger: 'blur' }],
        host: [{ required: true, message: '请填写目标网址', trigger: 'blur' }],
        iconv: [{ required: true, message: '请选择目标网站编码', trigger: 'change' }],
        collect_status: [{ required: true, message: '请选择采集状态', trigger: 'change' }],
        rules: {
          book_url: [{ required: true, message: '请填写小说信息页面地址', trigger: 'blur' }],
          name: [{ required: true, message: '请填写小说名称采集规则', trigger: 'blur' }],
          author: [{ required: true, message: '请填写小说作者采集规则', trigger: 'blur' }],
          chapter_url: [{ required: true, message: '请填写小说目录页面地址', trigger: 'blur' }],
          article_title: [{ required: true, message: '请填写章节名称采集规则', trigger: 'blur' }],
          article_id: [{ required: true, message: '请填写章节序号采集规则', trigger: 'blur' }],
          article_url: [{ required: true, message: '请填写章节内容页面地址', trigger: 'blur' }],
          content: [{ required: true, message: '请填写章节内容采集规则', trigger: 'blur' }]
        }

      }
    }
  },
  created() {
    if (this.$route.query.id && this.$route.query.id > 0) {
      this.collectId = this.$route.query.id
      this.getInfo()
    }
  },
  methods: {
    getInfo() {
      getNovelCollectInfoApi({ id: this.collectId }).then(response => {
        this.collectObj = response.data
      })
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          saveNovelCollectApi(this.collectObj).then(response => {
            this.$message.success('保存成功')
            setTimeout(() => {
              this.$router.push('/novel/collect/list')
            }, 2000)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.box-card{
    margin-bottom: 20px;
    font-size: 14px;
    .title{
        font-weight: bold;
    }
    .note{
        color: #999999;
        padding: 0;
        margin: 0;
        line-height: 22px;
        font-size: 12px;
    }
}
</style>
