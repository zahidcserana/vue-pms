<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="Mobile">
      <el-input v-model.trim="user.mobile" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          mobile: '',
          email: ''
        }
      }
    }
  },
  methods: {
    submit() {
      // const userData = Object.assign({}, this.user)
      // updatePatient(userData).then(() => {
      //   this.$message({
      //     message: 'User information has been updated successfully',
      //     type: 'success',
      //     duration: 5 * 1000
      //   })
      // }).catch(e => {
      //   console.log(e)
      // })
    }
  }
}
</script>
