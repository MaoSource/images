<template>
  <div class="file_box">
    <file-pond
      name="file"
      ref="pond"
      credits="https://wpa.qq.com/msgrd?v=3&uin=1134496928&site=qq&menu=yes,Source"
      label-idle="请选择文件或将文件拖拽,粘贴到此处"
      accepted-file-types="image/*"
      labelFileTypeNotAllowed="暂不支持该类型文件"
      fileValidateTypeLabelExpectedTypes="期望{allTypes}"
      :allow-multiple="true"
      maxFiles="2"
      max-files="2"
      maxFileSize="5MB"
      labelMaxFileSizeExceeded="文件过大"
      labelMaxFileSize="文件大小上限为 {filesize}"
      labelFileProcessing="上传中"
      labelTapToUndo="点击取消"
      labelFileProcessingComplete="上传完成"
      labelFileProcessingAborted="取消上传"
      labelFileProcessingError="上传错误"
      labelTapToCancel="点击取消"
      labelTapToRetry="点击重试"
      :server="server"
      :files="fileList"
      v-on:init="handleFilePondInit"
    />
  </div>
</template>
<script>
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
// import { Toast } from 'vant'
import axios from 'axios'
// import settings from '@/settings'
// Dialog, Notify,
// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
)

export default {
  name: 'file',
  components: {
    FilePond
  },
  props: {
    uploadHandler: {
      type: Function
    }
  },
  data: function () {
    return {
      fileList: [],
      server: {
        // url: settings.baseURL + 'img',
        // timeout: 7000,
        // process: (fieldName, file, metadata, load, error, progress, abort) => {
        //   // fieldName is the name of the input field
        //   // file is the actual file object to send
        //   const formData = new FormData()
        //   formData.append(fieldName, file, file.name)
        //   const request = new XMLHttpRequest()
        //   request.open('PUT', this.server.url)
        //   request.upload.onprogress = e => {
        //     progress(e.lengthComputable, e.loaded, e.total)
        //   }
        //   request.onload = () => {
        //     if (request.status >= 200 && request.status < 300) {
        //       // 这个是上传文件时的加载，加载执行完后会进入revert也就是删除
        //       load(request.responseText)
        //       const _this = this
        //       _this.$emit('success', request)
        //       // const parse = JSON.parse(request.response)
        //       // this.keys = parse.data
        //     } else {
        //       const _this = this
        //       _this.$emit('failure', request)
        //       // 失败的话进入
        //       // Can call the error method if something is wrong, should exit after
        //       error('oh no')
        //     }
        //   }
        //   request.send(formData)
        //   this.filesNames = request
        //   this.filesNames = null
        //   // Should expose an abort method so the request can be cancelled
        //   return {
        //     abort: () => {
        //       console.log('进入')
        //       Toast({
        //         message: '宝，上传失败了哦，快去找管理员来嘲讽他！',
        //         position: 'top'
        //       })
        //       // 点击取消进入该方法
        //       // This function is entered if the user has tapped the cancel button
        //       request.abort()
        //
        //       // Let FilePond know the request has been cancelled
        //       abort()
        //     }
        //   }
        // },
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          const formData = new FormData()
          formData.append(fieldName, file, file.name)

          const CancelToken = axios.CancelToken
          const source = CancelToken.source()

          this.uploadHandler(
            formData,
            (progressEvent) => {
              if (progressEvent.total > 0) {
                progress(progressEvent.lengthComputable, progressEvent.loaded, progressEvent.total)
              }
            },
            source.token,
            file
          )
            .then((response) => {
              load(response)
              // console.log('Uploaded successfully', response)
              this.$emit('success', response, file)
            })
            .catch((failure) => {
              // console.log('Failed to upload file', failure)
              this.$emit('failure', failure, file)
              error()
            })
          return {
            abort: () => {
              abort()
              console.log('Upload operation aborted by the user')
              source.cancel('Upload operation canceled by the user.')
            }
          }
        },
        revert: (uniqueFileId, load, error) => {
          // console.log('取消文件')
          // Should remove the earlier created temp file here
          // ...
          // this.file = JSON.parse(uniqueFileId).data.file
          // deleteFile(this.file).then(response => {
          //   const data = response.data;
          //   console.log(data);
          // });
          // console.log(this.file);
          this.filesNames = null

          // Can call the error method if something is wrong, should exit after
          // error('oh my goodness')

          // Should call the load method when done, no parameters required
          load()
        }
      },
      keys: ''
    }
  },
  methods: {
    // 初始化文件
    handleFilePondInit () {
      this.filesNames = null
      console.log('初始化成功')
      // FilePond instance methods are available on `this.$refs.pond`
    },
    // 删除文件
    handleClearFileList () {
      console.log('删除文件')
      this.$refs.pond.removeFiles()
      this.filesNames = null
    }
  }
}
</script>
<style scoped>
.file_box {
  margin: 20px;
}
</style>
