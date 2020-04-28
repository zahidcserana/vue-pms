<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="7">
                  <el-form-item label-width="60px" label="Doctor:" class="postInfo-container-item">
                    <el-select v-model="postForm.doctor_id" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="Search doctor" :disabled="is_disabled">
                      <el-option v-for="(item,index) in doctorListOptions" :key="item+index" :label="item.name" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label-width="60px" label="Patient:" class="postInfo-container-item">
                    <el-select v-model="postForm.patient_id" :remote-method="getRemotePatientList" filterable default-first-option remote placeholder="Search patient" :disabled="is_disabled" @change="onChange($event)">
                      <el-option v-for="(item,index) in patientListOptions" :key="item+index" :label="item.name + ' (' + item.mobile + ')'" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="60px" label="Gender:" class="postInfo-container-item">
                    <el-select v-model="postForm.gender" class="postInfo-container-item" placeholder="Please select">
                      <el-option v-for="item in genderOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-button v-loading="loading" style="margin-left: 10px;float:right" type="success" @click="submitForm"> Proceed </el-button>
                </el-col>
                <el-col :span="2">
                  <el-button v-if="is_show" v-loading="loading" style="margin-left: 10px;float:right" type="info" @click="prescription"> Prescription </el-button>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.name" :maxlength="100" name="name" required :readonly="is_readonly">
                Name
              </MDinput>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">
            <el-form-item style="margin-bottom: 40px;" prop="mobile">
              <MDinput v-model="postForm.mobile" :maxlength="100" name="mobile" required :readonly="is_readonly">
                Mobile
              </MDinput>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">
            <el-form-item style="margin-bottom: 40px;" prop="age">
              <MDinput v-model="postForm.age" :maxlength="100" name="age" required>
                Age
              </MDinput>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.problem" :maxlength="100" name="problem" required>
                Problem
              </MDinput>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="12">
            <el-form-item style="margin-bottom: 40px;" prop="advice">
              <MDinput v-model="postForm.advice" :maxlength="100" name="advice" required>
                Advice
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.description" :height="400" />
        </el-form-item> -->
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
    <el-form class="form-container">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="6" class="prescribedmedicine">
            <div v-for="(item,index) in pDescription" :key="index">
              <strong> <span> {{ index + 1 }}. {{ item.medicine | strippedContent }}</span> </strong> <br>
              <span> &nbsp;&nbsp;&nbsp; {{ item.rule | strippedContent }}, {{ item.duration | strippedContent }}</span> <br>
              <br>
            </div>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="6">
            <el-form-item label="Medicine" prop="medicine">
              <el-input v-model="descArr.medicine" />
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="2">
            <el-form-item label="Rule" prop="rule">
              <el-input v-model="descArr.rule" />
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="2">
            <el-form-item label="Duration" prop="duration">
              <el-input v-model="descArr.duration" @keyup.enter="submitDescription" />
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="2" style="margin-top: 35px;">
            <el-button type="success" @click="submitDescription"> Add </el-button>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
        </el-row>
      </div>
    </el-form>
    <el-dialog v-if="is_show" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <template>
        <div>
          <el-row>
            <el-col :span="12">
              <span>{{ appointmentInfo.doctor.title }}</span> <br>
              <span>{{ appointmentInfo.doctor.name }}</span> <br>
              <span>{{ appointmentInfo.doctor.education }}, {{ appointmentInfo.doctor.experience }}</span>
            </el-col>
            <el-col :span="12">
              <span>{{ appointmentInfo.doctor.organisation }}</span> <br>
              <span>{{ appointmentInfo.doctor.location }}</span>
            </el-col>
          </el-row>
          <hr>
          <el-row>
            <el-col :span="6">
              <strong>Name: </strong><span>{{ appointmentInfo.name }}</span>
            </el-col>
            <el-col :span="6">
              <strong>Gender: </strong><span>{{ appointmentInfo.gender }}</span>
            </el-col>
            <el-col :span="6">
              <strong>Mobile: </strong><span>{{ appointmentInfo.mobile }}</span>
            </el-col>
            <el-col :span="6">
              <strong>Age: </strong><span>{{ appointmentInfo.age }}</span>
            </el-col>
          </el-row>
          <hr>
          <el-row>
            <el-col :span="8">
              <span>{{ appointmentInfo.problem }}</span> <br>
            </el-col>
            <el-col :span="16" class="vl">
              <div v-for="(item,index) in pDescription" :key="index">
                <strong> <span> {{ index + 1 }}. {{ item.medicine | strippedContent }}</span> </strong> <br>
                <span> &nbsp;&nbsp;&nbsp; {{ item.rule | strippedContent }}, {{ item.duration | strippedContent }}</span> <br>
                <br>
              </div>
            </el-col>
          </el-row>
          <el-row style="text-align: center;">
            <span>Note: {{ appointmentInfo.advice }}</span> <br>
          </el-row>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="printDiv('printMe')">
          Print
        </el-button>
      </div>
    </el-dialog>
    <div v-if="is_show" style="display: none">
      <div id="printMe">
        <table class="table table-responsive" style="width: 100%;padding: 2%;border: 1px solid grey;">
          <tr>
            <td colspan="2" style="width: 60%;">
              <table>
                <tr><td><span>{{ appointmentInfo.doctor.title }}</span></td></tr>
                <tr><td><span>{{ appointmentInfo.doctor.name }}</span></td></tr>
                <tr><td><span>{{ appointmentInfo.doctor.education }}, {{ appointmentInfo.doctor.experience }}</span></td></tr>
              </table>
            </td>
            <td style="width: 40%;">
              <table>
                <tr><td><span>{{ appointmentInfo.doctor.organisation }}</span></td></tr>
                <tr><td><span>{{ appointmentInfo.doctor.location }}</span></td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="border-top: 2px solid gray;">
              <strong>Name: </strong><span>{{ appointmentInfo.name }}</span>,
              &nbsp;
              <strong>Gender: </strong><span>{{ appointmentInfo.gender }}</span>,
              &nbsp;
              <strong>Mobile: </strong><span>{{ appointmentInfo.mobile }}</span>,
              &nbsp;
              <strong>Age: </strong><span>{{ appointmentInfo.age }}</span>
            </td>
          </tr>
          <tr>
            <td style="width: 40%;border-top: 2px solid gray;">
              <table>
                <tr><td><span>{{ appointmentInfo.problem }}</span></td></tr>
              </table>
            </td>
            <td colspan="2" style="width: 60%;border-top: 2px solid gray;border-left:4px solid gray;height: 100%;padding: 2%;">
              <table>
                <tr v-for="(item,index) in pDescription" :key="index">
                  <td>
                    <strong> <span> {{ index + 1 }}. {{ item.medicine | strippedContent }}</span> </strong> <br>
                    <span> &nbsp;&nbsp;&nbsp; {{ item.rule | strippedContent }}, {{ item.duration | strippedContent }}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="width: 40%;">&nbsp;</td>
            <td colspan="2" style="width: 60%;padding: 2%;"><span>Note: {{ appointmentInfo.advice }}</span></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import { getAppointment, createAppointment, updateAppointment } from '@/api/appointment'
import { searchDoctor, defaultDoctor, searchPatient } from '@/api/remote-search'
import { env } from '@/utils'
import moment from 'moment'

const defaultForm = {
  name: '',
  age: '',
  doc_image: undefined,
  doc_file: undefined,
  description: '',
  problem: '',
  advice: '',
  mobile: '',
  patient_id: '',
  doctor_id: '',
  gender: '',
  id: undefined
}
const genderOptions = [
  { key: 'MALE', display_name: 'Male' },
  { key: 'FEMALE', display_name: 'Female' }
]
export default {
  name: 'AppointmentDetail',
  components: { MDinput, Upload },
  filters: {
    strippedContent: function(string) {
      return string.replace(/<\/?[^>]+>/ig, ' ')
    },
    dateFormat(date) {
      return moment(String(date)).format('dddd, MMMM Do YYYY, hh:mm a')
    }
  },
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
      appointmentInfo: {},
      defaultDoctorId: 1,
      isDocImage: false,
      isDocFile: false,
      is_readonly: false,
      is_disabled: false,
      is_show: false,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      doctorListOptions: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Prescription',
        create: 'Create'
      },
      patientListOptions: [],
      genderOptions,
      pDescription: [],
      rules: {
        doc_image: [{ validator: validateRequire }],
        name: [{ validator: validateRequire }],
        description: [{ validator: validateRequire }]
      },
      descArr: {
        medicine: '',
        rule: '',
        duration: ''
      },
      tempRoute: {},
      updateInput: {
        id: undefined,
        description: '',
        problem: '',
        advice: '',
        gender: '',
        age: '',
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
  mounted() {
    // if (localStorage.getItem('pDescription')) {
    //   try {
    //     this.pDescription = JSON.parse(localStorage.getItem('pDescription'))
    //   } catch (e) {
    //     localStorage.removeItem('pDescription')
    //   }
    // }
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
    printDiv(elem) {
      const mywindow = window.open('', 'PRINT', 'height=400,width=600')

      mywindow.document.write('<html><head><title>' + document.title + '</title>')
      mywindow.document.write('</head><body >')
      // mywindow.document.write('<h3>' + document.title + '</h3>')
      mywindow.document.write(document.getElementById(elem).innerHTML)
      mywindow.document.write('</body></html>')

      mywindow.document.close() // necessary for IE >= 10
      mywindow.focus() // necessary for IE >= 10*/

      mywindow.print()
      mywindow.close()

      return true
    },
    // printDiv(divName) {
    //   const printContents = document.getElementById(divName).innerHTML
    //   const originalContents = document.body.innerHTML
    //   document.body.innerHTML = printContents
    //   window.print()
    //   document.body.innerHTML = originalContents
    // },
    submitDescription: function() {
      if (!this.descArr.medicine) {
        return
      }
      this.pDescription.push(this.descArr)
      // const parsed = JSON.stringify(this.pDescription)
      // localStorage.setItem('pDescription', parsed)
      this.descArr = {}
    },
    onChange(userId) {
      const patientInfo = this.patientListOptions.find(m => m.id === userId)
      this.postForm.name = patientInfo.name
      this.postForm.mobile = patientInfo.mobile
      this.postForm.age = patientInfo.age
      this.postForm.gender = patientInfo.gender
    },
    fetchData(id) {
      getAppointment(id).then(response => {
        this.postForm = response.data
        this.appointmentInfo = response.data

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
        this.postForm.title += `Appointment Id:${this.postForm.id}`
        this.postForm.content_short += `Appointment Id:${this.postForm.id}`
        this.is_show = true

        this.pDescription = JSON.parse(response.data.description)

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
      const title = 'Appointment'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Appointment'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const userData = Object.assign({}, this.postForm)
          const parsed = JSON.stringify(this.pDescription)
          if (userData.id > 0) {
            this.updateInput.id = userData.id
            this.updateInput.description = parsed
            this.updateInput.problem = userData.problem
            this.updateInput.age = userData.age
            this.updateInput.gender = userData.gender
            this.updateInput.advice = userData.advice
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
            // this.fetchData(userData.id)
          } else {
            userData.description = parsed
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
    prescription() {
      this.appointmentInfo = Object.assign({}, this.appointmentInfo)
      // this.pDescription = this.appointmentInfo.description.split('<li>')
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
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
.prescribedmedicine {
  padding: 1%;
  border: 3px solid gray;
}
.vl {
  border-left:4px solid gray;
  height: 100%;
  padding: 2%;
}
</style>
