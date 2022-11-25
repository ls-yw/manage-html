<template>
  <main>
    <div class="toolbar-container" />
    <div id="editor" />
  </main>
</template>

<script>

import './zh-cn'
import { uploadApi } from '@/api/upload'

class MyUploadAdapter {
  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          this.uploadFile(file, resolve)
        })
    )
  }

  uploadFile(file, resolve) {
    const formData = new FormData()
    formData.append('type', 'image')
    formData.append('file', file)
    uploadApi('novel', formData).then(result => {
      resolve({
        default: result.data
      })
    })
  }

  // Aborts the upload process.
  abort() {
    // Reject the promise returned from the upload() method.
    // server.abortUpload();
  }
}

export default {
  name: 'CkEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
    // disabled: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      editor: null,
      first: true,
      lastEditorData: ''
    }
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue && newValue !== this.lastEditorData) {
        try {
          this.editor.setData(newValue)
        } catch (error) {
          // -
        }
      }
    }
    // disabled(val) {
    //   this.editor.isReadOnly = val
    // }
  },
  mounted() {
    window.ClassicEditor.create(document.querySelector('#editor'), {
      language: 'zh-cn',
      fontFamily: {
        options: [
          '默认字体, default',
          '宋体, SimSun',
          '黑体, SimHei',
          '微软雅黑, Microsoft YaHei',
          '微软正黑体, Microsoft JhengHei',
          '新宋体, NSimSun',
          '新细明体, PMingLiU',
          '细明体, MingLiU',
          '标楷体, DFKai-SB',
          '仿宋, FangSong',
          '楷体, KaiTi',
          '仿宋_GB2312, FangSong_GB2312',
          '楷体_GB2312, KaiTi_GB2312'
        ]
      }
    })
      .then(editor => {
        const toolbarContainer = document.querySelector(
          'main .toolbar-container'
        )

        toolbarContainer.prepend(editor.ui.view.toolbar.element)

        // window.editor = editor;
        this.editor = editor
        editor.plugins.get('FileRepository').createUploadAdapter = loader => {
          return new MyUploadAdapter(loader)
        }
        editor.model.document.on('change:data', () => {
          // const editorContent = editor.getData().replace(/(<figure[^>]*.*?>)(.*?)(<\/figure>)/gi, '$2')
          const editorContent = editor.getData()
          this.lastEditorData = editorContent
          this.$emit('input', editorContent)
          this.$emit('change', editorContent)
        })
        // editor.isReadOnly = this.disabled
      })
      .catch(err => {
        console.error(err.stack)
      }).finally(() => {
      // setTimeout(() => {
      // }, 300);

        this.editor.setData(this.value)
      })
  }
}
</script>

<style lang="scss" >
.ck-editor__editable {
  min-height: 200px;
}
</style>
