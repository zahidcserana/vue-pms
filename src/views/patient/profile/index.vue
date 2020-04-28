<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" :summary="summary" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity">
                <activity :payment="payment" />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline :timeline="timeline" />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import { patientInfo, getPatientSummary } from '@/api/patient'
import { getPatientAppointments } from '@/api/appointment'
import { getPatientPayments } from '@/api/payment'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account },
  data() {
    return {
      loading: true,
      user: {},
      summary: {},
      timeline: [],
      payment: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
    this.getAppointments()
    this.getPayments()
    this.getSummary()
  },
  methods: {
    getUser() {
      const id = this.$route.params && this.$route.params.id
      patientInfo(id).then(response => {
        this.user = response.data
        this.user.avatar = this.avatar
        this.user.role = this.roles.join(' | ')
        setTimeout(() => {
          this.loading = false
        }, 1.5 * 1000)
      }).catch(e => {
        console.log(e)
      })
    },
    getSummary() {
      const id = this.$route.params && this.$route.params.id
      getPatientSummary(id).then(response => {
        this.summary = response.data
        setTimeout(() => {
          this.loading = false
        }, 1.5 * 1000)
      }).catch(e => {
        console.log(e)
      })
    },
    getAppointments() {
      const id = this.$route.params && this.$route.params.id
      getPatientAppointments(id).then(response => {
        this.timeline = response.data
        this.timeline.forEach(item => {
          item.description = JSON.parse(item.description)
        })
        setTimeout(() => {
          this.loading = false
        }, 1.5 * 1000)
      }).catch(e => {
        console.log(e)
      })
    },
    getPayments() {
      const id = this.$route.params && this.$route.params.id
      getPatientPayments(id).then(response => {
        this.payment = Object.assign({}, response.data)
        setTimeout(() => {
          this.loading = false
        }, 1.5 * 1000)
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>
