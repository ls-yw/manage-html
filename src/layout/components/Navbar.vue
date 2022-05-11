<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <span style="float: right;margin-left: 5px;cursor: pointer;">{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="setPassword">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { setPasswordApi } from '@/api/admin'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validateRePassword = (rule, value, callback) => {
      if (value !== this.setPasswordObj.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      dialogSetPassword: false,
      setPasswordObj: {},
      rules: {
        oldPassword: [{ required: true, message: '请填写正确的原密码', min: 6, trigger: 'blur' }],
        password: [{ required: true, message: '密码不能小于6位', min: 6, trigger: 'blur' }],
        rePassword: [{ required: true, message: '两次密码不一致', validator: validateRePassword, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    setPassword() {
      this.dialogSetPassword = true
    },
    savePassword() {
      this.$refs.setPasswordForm.validate(valid => {
        if (valid) {
          setPasswordApi(this.setPasswordObj).then(response => {
            if (response.code === 0) {
              this.$message.success('修改成功，请重新登录')
              this.dialogSetPassword = false
              setTimeout(this.logout, 2000)
            } else {
              this.$message.error(response.msg)
            }
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

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color:transparent;

        &:hover {
            background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background .3s;

                &:hover {
                    background: rgba(0, 0, 0, .025)
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 20px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
