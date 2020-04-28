<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.created_at | dateFormat" placement="top">
        <el-card>
          <h4>{{ item.name }}</h4>
          <h3>{{ item.problem }}</h3>
          <div v-for="(prescription,q) of (item.description)" :key="q">
            <p> <strong>{{ q + 1 }}.</strong> {{ prescription.medicine }} </p>
            <p> &nbsp;&nbsp;&nbsp; {{ prescription.rule }}, {{ prescription.duration }} </p>
          </div>
          <!-- <p>{{ item.description | strippedContent }}</p> -->
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  filters: {
    strippedContent: function(string) {
      return string.replace(/<\/?[^>]+>/ig, ' ')
    },
    dateFormat(date) {
      return moment(String(date)).format('dddd, MMMM Do YYYY, hh:mm a')
    }
  },
  props: {
    timeline: {
      type: Array,
      default: () => {
        return {
          created_at: '',
          problem: '',
          name: '',
          description: ''
        }
      }
    }
  },
  data() {
    return {
    }
  }
}
</script>
