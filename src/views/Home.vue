<template>
  <div class="component">
    <van-sticky>
      <van-search
        class="sticky"
        v-model="value"
        placeholder="请输入图片编号"
        @search="onSearch"
        input-align="center"
      />
    </van-sticky>
    <div @click="tz()" class="title">
      Source
    </div>
    <file ref="avatar" @success="success" @failure="failure" :upload-handler="uploadHandler"/>
    <div style="text-align: center">本图床使用贴图库服务，请遵守贴图库上传须知，禁止上传色情、反动、暴力等违法违规图片</div>
    <el-table
      @expand-change="expandSelect"
      :row-key='getRowKeys'
      :expand-row-keys="expands"
      style="opacity: 0.9"
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      element-loading-text="Loading"
      highlight-current-row
      border
      lazy
      fit
    >
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.id">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.url"
              :preview-src-list="imgPre(scope.row.url)">
            </el-image>
          </span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column class="hidden-xs-only" :show-overflow-tooltip="true" label="编号" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.desc">
            {{ scope.row.desc }}
          </span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="文件类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type">
            {{ scope.row.type }}
          </span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.createTime">
            {{ scope.row.createTime }}
          </span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <!--      展开-->
      <el-table-column class="hidden-xs-only" label="详细" width="60%" type="expand">
        <template slot-scope="props">
          <div class="hidden-sm-and-up">
            <van-swipe-cell>
              <van-card
                currency="文件大小："
                :price="props.row.filesize"
                desc="移动端暂时无法查看更多信息"
                title="图片详细"
                class="goods-card"
                :thumb="props.row.url"
              >
                <template #footer>
                  <van-button download="图片" @click="download(props.row)" size="mini">下载图片</van-button>
                  <van-button @click="copyURL(props.row.url)" size="mini">复制URL</van-button>
                  <van-button @click="copyURL(props.row.desc)" size="mini">复制编号</van-button>
                </template>
              </van-card>
              <template #right>
                <van-button square text="删除" @click="deleteMubItem(props.row)" type="danger" class="delete-button" />
              </template>
            </van-swipe-cell>
          </div>
          <el-form class="hidden-xs-only table-expand" style="background-color: rgb(247,247,247)" label-position="left" inline>
            <el-form-item label="图片链接">
              <div v-if="props.row.url">
                <div style="margin-top: 5px">
                  <el-input size="mini" placeholder="图片链接" :value="props.row.url" class="input-with-select">
                    <el-button slot="append" @click="copyURL(props.row.url)">复制</el-button>
                  </el-input>
                </div>
              </div>
              <span v-else>暂无</span>
            </el-form-item>
            <el-form-item label="网页贴图代码(HTML)">
              <div v-if="props.row.url">
                <div style="margin-top: 10px">
                  <el-input size="mini" placeholder="网页贴图代码(HTML)" :value="'<a href='+ props.row.url +'><img src= ' + props.row.url + ' border= ' + 0 + ' /></a>'" class="input-with-select">
                    <el-button slot="append" @click="copyURL('<a href='+ props.row.url +'><img alt='+ '图片' +' src= ' + props.row.url + ' border= ' + 0 + ' /></a>')">复制</el-button>
                  </el-input>
                </div>
              </div>
              <span v-else>暂无</span>
            </el-form-item>
            <el-form-item label="论坛贴图代码(BBCode)">
              <div v-if="props.row.url">
                <div style="margin-top: 10px">
                  <el-input size="mini" placeholder="论坛贴图代码(BBCode)" :value="'[url=' + imgURL + ']' + props.row.url + '[img][/img][/url]'" class="input-with-select">
                    <el-button slot="append" @click="copyURL('[url=' + props.row.url + ']' + props.row.url + '[img][/img][/url]')">复制</el-button>
                  </el-input>
                </div>
              </div>
              <span v-else>暂无</span>
            </el-form-item>
            <el-form-item label="Markdown代码">
              <div v-if="props.row.url">
                <div style="margin-top: 10px">
                  <el-input size="mini" placeholder="Markdown代码" :value="'[![images.jpg](' + props.row.url + ')](' + props.row.url + ')'" class="input-with-select">
                    <el-button slot="append" @click="copyURL('[![images.jpg](' + props.row.url + ')](' + props.row.url + ')')">复制</el-button>
                  </el-input>
                </div>
              </div>
              <span v-else>暂无</span>
            </el-form-item>
            <el-form-item label="编号(图片查询唯一表示)">
              <span v-if="props.row.url">
                <div style="margin-top: 5px">
                  <el-input size="mini" placeholder="图片链接" :value="props.row.desc" class="input-with-select">
                    <el-button slot="append" @click="copyURL(props.row.desc)">复制</el-button>
                  </el-input>
                </div>
              </span>
              <span v-else>暂无</span>
            </el-form-item>
            <el-form-item label="MD5">
              <span v-if="props.row.md5">
                <div style="margin-top: 10px">
                  <el-input size="mini" placeholder="MD5" :value="props.row.md5" class="input-with-select">
                    <el-button slot="append" @click="copyURL(props.row.md5)">复制</el-button>
                  </el-input>
                </div>
              </span>
              <span v-else>暂无</span>
            </el-form-item>
            <el-form-item label="文件类型">
              <span v-if="props.row.type">
                {{ props.row.type }}
              </span>
              <span v-else>暂无</span>
            </el-form-item>
            <el-form-item label="文件大小">
              <span v-if="props.row.filesize">
                {{ props.row.filesize }}
              </span>
              <span v-else>暂无</span>
            </el-form-item>
            <el-form-item label="上传时间">
              <span v-if="props.row.createTime">
                {{ props.row.createTime }}
              </span>
              <span v-else>暂无</span>
            </el-form-item>
            <el-form-item label="操作">
              <span>
                <el-tooltip :open-delay="500" content="下载" class="item" effect="dark" placement="bottom">
                  <el-button type="info" size="mini" @click="download(props.row)">下载</el-button>
                </el-tooltip>
                <el-tooltip :open-delay="500" content="删除" class="item" effect="dark" placement="bottom">
                  <el-button type="danger" size="mini" @click="deleteItem(props.row)">删除</el-button>
                </el-tooltip>
              </span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <van-pagination @change="nextPage()" v-model="currentPage" :page-count="pages" mode="simple" />
  </div>
</template>
<script>
import { Dialog, Toast } from 'vant'
import File from '@/components/upload/file'
import settings from '@/settings'

export default {
  name: 'Home',
  components: {
    File
  },
  created () {
    this.fetch()
    this.$alert('<strong>' +
      '宝别传黄图，搞颜色我就<span style="color: red">封你IP</span><br/>' +
      '无需登录即可上传,最大支持5M的图片,每日上限10张<br/>' +
      '上传成功后密钥是图片的唯一查询方式记得保存哦<br/>' +
      '全站启用SSL加密链接，保障您的信息安全.<br/>' +
      '除违反TOS之外, 我们不会删除图片, 即使是多年无任何流量的图片也不会删除.<br/>' +
      '违法以上规定直接删除图片不另行通知<br/>' +
      '上传的图片也是可以自己删除的(移动端可以通过右滑删除)<br/>' +
      '找作者吹牛逼<a href="https://wpa.qq.com/msgrd?v=3&uin=1134496928&site=qq&menu=yes">点这里</a></strong>', '帮助', {
      dangerouslyUseHTMLString: true,
      distinguishCancelAndClose: true,
      showClose: false,
      center: true
    })
  },
  data: function () {
    return {
      imgURL: settings.imgURL,
      desc: '',
      fileList: [],
      opWith: '200px',
      file: '',
      keys: '',
      filesNames: '',
      currentPage: 1,
      value: '',
      pagination: {
        size: 5,
        num: 1
      },
      list: {},
      total: {},
      pages: '',
      tableData: [],
      loading: false,
      message: 'Copy These Text',
      IP: '',
      dowName: 'images',
      getRowKeys (row) {
        return row.id
      },
      expands: []
    }
  },
  methods: {
    uploadHandler (formData, uploadProgress, cancelToken) {
      return this.$uploads(formData, uploadProgress, cancelToken).then(r => {
        Toast({
          message: r.data.data,
          position: 'top'
        })
      })
    },
    // 折叠面板每次只能展开一行
    expandSelect (row, expandedRows) {
      const that = this
      if (expandedRows.length) {
        that.expands = []
        if (row) {
          that.expands.push(row.id)
        }
      } else {
        that.expands = []
      }
    },
    fetch (params = {}) {
      params.pageSize = this.pagination.size
      params.pageNum = this.pagination.num
      params.desc = this.desc
      this.loading = true
      this.$get('/img', params).then((r) => {
        const data = r.data.data
        this.tableData = data.records
        this.pages = data.pages
        this.loading = false
      })
    },
    // 初始化文件
    handleFilePondInit () {
      this.filesNames = null
      console.log('初始化成功')
      // FilePond instance methods are available on `this.$refs.pond`
    },
    // 删除文件
    handleClearFileList () {
      this.$refs.pond.removeFiles()
      this.filesNames = null
    },
    onSearch (val, param = {}) {
      if (val === null || val === '') {
        this.fetch()
      } else {
        this.loading = true
        param.desc = val
        this.$get('/img', {
          ...param
        }).then(r => {
          const data = r.data.data
          console.log(data)
          this.tableData = data.records
          this.pages = data.pages
          this.loading = false
        })
      }
    },
    tz () {
      window.location.href = 'https://maosource.com'
    },
    delete (val, param = {}) {
      param = val
      this.$delete('/img', {
        ...param
      }).then(r => {
        this.fetch()
        Toast({
          message: '删除成功！',
          position: 'top'
        })
      }).catch(e => {
        Toast({
          message: '删除失败！' + e,
          position: 'top'
        })
      })
    },
    deleteMubItem (props) {
      Dialog.confirm({
        title: '提示',
        message: '此操作将永久删除该文件, 是否继续?'
      })
        .then(() => {
          this.delete(props)
          // on confirm
        })
        .catch(() => {
          Toast({
            message: '已取消删除',
            position: 'top'
          })
        })
    },
    deleteItem (props) {
      console.log(props)
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '此操作将永久删除该文件, 是否继续?')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        beforeClose: (action, instance, done, param = {}) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            param.fileName = props.fileName
            param.createTime = props.createTime
            param.id = props.id
            this.$delete('/img', param).then(() => {
              setTimeout(() => {
                setTimeout(() => {
                  instance.confirmButtonLoading = false
                }, 300)
              }, 3000)
              this.fetch()
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              done()
            }).catch(e => {
              instance.confirmButtonLoading = false
              console.log(e)
              done()
            })
          } else {
            done()
          }
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    download (val) {
      this.downloadImage(val.url, val.fileName)
      Toast({
        message: '下载成功',
        position: 'top'
      })
    },
    downloadImage (imgSrc, name) { // 下载图片地址和图片名
      const image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        const url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
        const a = document.createElement('a') // 生成一个a元素
        const event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgSrc
    },
    copyURL (val) {
      this.$copyText(val).then(function () {
        Toast({
          message: '复制成功',
          position: 'top'
        })
      }, function (e) {
        Toast({
          message: '复制失败',
          position: 'top'
        })
        console.log(e)
      })
    },
    imgPre (val) {
      return [val]
    },
    nextPage () {
      this.pagination.num = this.currentPage
      this.fetch()
    },
    // 上传成功返回
    success () {
      this.pagination.num = 0
      this.fetch()
    },
    failure (val) {
      // const parse = JSON.parse(val.response)
      Toast({
        message: '宝，上传失败了，快去找管理员嘲讽他！',
        position: 'top'
      })
    }
  }
}
</script>
<style scoped lang="scss">
.title{
  margin-top: 20px;
  text-align: center;
  font-size: 50px;
}
.table-expand {
  width: 100%;
  padding: 20px 40px;
.el-form-item {
  display: inline-block;
  width: 48%;
  margin-right: 0;
  margin-bottom: 0;
}
label {
  width: 170px;
}
}
.table-header-wrap {
  height: 60px;
  border: 1px solid #ebeef5;
  padding: 15px;
  border-bottom: none;
  background: #fafbfc;
  position: relative;

.search {
  position: absolute;
  top: 15px;
  right: 15px;
}
.options {
  position: absolute;
  top: 15px;
  left: 15px;
}
}
.sticky {
  max-width: 750px;
  margin: auto;
  position: relative;
  top: 0;
  width: 100%;
  opacity: 0.95
}
</style>
<style scoped>
.goods-card {
  margin: 0;
  /*background-color: @white;*/
}

.delete-button {
  height: 100%;
}
</style>
