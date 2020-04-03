<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="10">
                  <el-form-item label-width="60px" label="Doctor:" class="postInfo-container-item">
                    <el-select v-model="postForm.doctor_id" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="Search doctor" :disabled="is_disabled">
                      <el-option v-for="(item,index) in doctorListOptions" :key="item+index" :label="item.name" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label-width="60px" label="Patient:" class="postInfo-container-item">
                    <el-select v-model="postForm.patient_id" :remote-method="getRemotePatientList" filterable default-first-option remote placeholder="Search patient" :disabled="is_disabled" @change="onChange($event)">
                      <el-option v-for="(item,index) in patientListOptions" :key="item+index" :label="item.name + ' (' + item.mobile + ')'" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button v-loading="loading" style="margin-left: 10px;float:right" type="success" @click="submitForm"> Proceed </el-button>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.problem" :maxlength="100" name="age" required :readonly="is_readonly">
                Problem
              </MDinput>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.name" :maxlength="100" name="name" required :readonly="is_readonly">
                Name
              </MDinput>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.mobile" :maxlength="100" name="mobile" required :readonly="is_readonly">
                Mobile
              </MDinput>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="3">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.age" :maxlength="100" name="age" required :readonly="is_readonly">
                Age
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.description" :height="400" />
        </el-form-item>
        <el-form-item v-show="!isDocImage" prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.doc_image" />
        </el-form-item>
        <el-form-item v-show="!isDocFile" prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.doc_file" />
        </el-form-item>
        <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <a v-show="isDocImage" :href="postForm.doc_image" target="_blank">
            <div class="image-preview image-app-preview">
              <div class="image-preview-wrapper">
                <img :src="postForm.doc_image">
              </div>
            </div>
          </a>
          <a v-show="isDocFile" :href="postForm.doc_file" target="_blank">
            <div class="image-preview image-app-preview">
              <div class="image-preview-wrapper">
                <img :src="postForm.doc_file">
              </div>
            </div>
          </a>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import { getAppointment, createAppointment, updateAppointment } from '@/api/appointment'
import { searchDoctor, defaultDoctor, searchPatient } from '@/api/remote-search'
import { env } from '@/utils'

const defaultForm = {
  name: '',
  age: '',
  doc_image: undefined,
  doc_file: undefined,
  description: '',
  problem: '',
  mobile: '',
  patient_id: '',
  doctor_id: '',
  id: undefined
}

export default {
  name: 'AppointmentDetail',
  components: { Tinymce, MDinput, Upload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + 'Required',
          type: 'error'
        })
        callback(new Error(rule.field + 'Required'))
      } else {
        callback()
      }
    }
    return {
      defaultDoctorId: 1,
      isDocImage: false,
      isDocFile: false,
      is_readonly: false,
      is_disabled: false,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      doctorListOptions: [],
      patientListOptions: [],
      rules: {
        doc_image: [{ validator: validateRequire }],
        name: [{ validator: validateRequire }],
        description: [{ validator: validateRequire }]
      },
      tempRoute: {},
      updateInput: {
        id: undefined,
        description: '',
        doc_image: undefined,
        doc_file: undefined
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.getDefaultDoctor(this.defaultDoctorId)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    onChange(userId) {
      const patientInfo = this.patientListOptions.find(m => m.id === userId)
      this.postForm.name = patientInfo.name
      this.postForm.mobile = patientInfo.mobile
      this.postForm.age = patientInfo.age
    },
    fetchData(id) {
      getAppointment(id).then(response => {
        this.postForm = response.data
        this.postForm.doctor_id = response.data.doctor.name
        this.postForm.patient_id = response.data.patient.name
        if (response.data.doc_image !== null) {
          this.isDocImage = true
          this.postForm.doc_image = env.api_url + response.data.doc_image
        } else {
          this.postForm.doc_image = undefined
        }
        if (response.data.doc_file !== null) {
          this.isDocFile = true
          this.postForm.doc_file = env.api_url + response.data.doc_file
        } else {
          this.postForm.doc_file = undefined
        }
        this.postForm.title += `   Appointment Id:${this.postForm.id}`
        this.postForm.content_short += `   Appointment Id:${this.postForm.id}`

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
        this.is_readonly = true
        this.is_disabled = true
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Appointment'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Appointment'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const userData = Object.assign({}, this.postForm)
          if (userData.id > 0) {
            this.updateInput.id = userData.id
            this.updateInput.description = userData.description
            this.updateInput.doc_file = this.isDocFile ? undefined : userData.doc_file
            this.updateInput.doc_image = this.isDocImage ? undefined : userData.doc_image
            updateAppointment(this.updateInput).then(() => {
              this.$notify({
                title: 'Success',
                message: 'Updated Successfully',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            createAppointment(userData).then((res) => {
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
              this.$router.push({ path: `/appointment/edit/${res.data.id}` })
            })
          }
          this.loading = false
        } else {
          return false
        }
      })
    },
    getRemoteUserList(query) {
      searchDoctor(query).then(response => {
        if (!response.data.items) return
        this.doctorListOptions = response.data.items
        // this.doctorListOptions = response.data.items.map(v => v.name)
      })
    },
    getDefaultDoctor(id) {
      defaultDoctor(id).then(response => {
        if (!response.data) return
        this.doctorListOptions = response.data.items
        this.postForm.doctor_id = id
      })
    },
    getRemotePatientList(query) {
      searchPatient(query).then(response => {
        if (!response.data) return
        this.patientListOptions = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.image-preview {
  width: 200px;
  height: 200px;
  position: relative;
  border: 1px dashed #d9d9d9;
  float: left;
  margin-left: 50px;
  .image-preview-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.image-app-preview {
  width: 320px;
  height: 180px;
  position: relative;
  border: 1px dashed #d9d9d9;
  float: left;
  margin-left: 50px;
  .app-fake-conver {
    height: 44px;
    position: absolute;
    width: 100%; // background: rgba(0, 0, 0, .1);
    text-align: center;
    line-height: 64px;
    color: #fff;
  }
}
</style>
