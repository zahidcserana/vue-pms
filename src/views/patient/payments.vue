<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.patient_id" class="filter-item" style="width: 140px" :remote-method="getRemotePatientList" filterable default-first-option remote placeholder="Search patient" @change="handleFilter">
        <el-option v-for="(item,index) in patientListOptions" :key="item+index" :label="item.name + ' (' + item.mobile + ')'" :value="item.id" />
      </el-select>
      <el-date-picker v-model="listQuery.date_from" class="filter-item" type="date" format="yyyy-MM-dd" placeholder="Date From" />
      <el-date-picker v-model="listQuery.date_to" class="filter-item" type="date" format="yyyy-MM-dd" placeholder="Date To" />
      <el-select v-model="listQuery.ordering" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetData">
        Reset
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Time" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Patient" width="200px">
        <template slot-scope="{row}">
          <router-link :to="'/patients/edit/'+row.patient.id" class="link-type">
            <span> {{ row.patient.name }} </span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="Mobile" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.patient.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Amount" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Description" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description.substring(0,20)+".." }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="user" label-position="left" label-width="120px" style="width: 420px; margin-left:50px;">
        <el-form-item label="Patient" prop="patient_id">
          <el-select v-model="user.patient_id" :remote-method="getRemotePatientList" filterable default-first-option remote placeholder="Search patient" :disabled="is_disabled">
            <el-option v-for="(item,index) in patientListOptions" :key="item+index" :label="item.name + ' (' + item.mobile + ')'" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Amount" prop="amount">
          <el-input v-model="user.amount" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="user.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv } from '@/api/article'
import { fetchPaymentList, createPayment, updatePayment } from '@/api/payment'
import { searchPatient } from '@/api/remote-search'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import moment from 'moment'

export default {
  name: 'Payment',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      is_disabled: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        patient_id: undefined,
        date_from: undefined,
        date_to: undefined,
        ordering: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      user: {
        id: undefined,
        patient_id: '',
        amount: '',
        description: 'N/A'
      },
      updateDate: {
        id: undefined,
        amount: '',
        description: 'N/A'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      patientListOptions: [],
      rules: {
        amount: [{ required: true, message: 'amount is required', trigger: 'blur' }],
        patient_id: [{ required: true, message: 'patient is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.listQuery.date_from) {
        this.listQuery.date_from = this.backEndDateFormat(this.listQuery.date_from)
      }
      if (this.listQuery.date_to) {
        this.listQuery.date_to = this.backEndDateFormat(this.listQuery.date_to)
      }
      fetchPaymentList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleUpdate(row) {
      this.user = Object.assign({}, row) // copy obj
      this.user.patient_id = this.user.patient.name
      this.dialogStatus = 'update'
      this.is_disabled = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const userData = Object.assign({}, this.user)
          createPayment(userData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const userData = Object.assign({}, this.user)
          this.updateDate.id = userData.id
          this.updateDate.description = userData.description
          this.updateDate.amount = userData.amount
          updatePayment(this.updateDate).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Updated Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    backEndDateFormat: function(date) {
      return moment(date, 'YYYY-MM-DD h:mm:ss').format('YYYY-MM-DD')
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetData() {
      this.resetTemp()
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.ordering = '+id'
      } else {
        this.listQuery.ordering = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.user = {
        id: undefined,
        patient_id: '',
        amount: '',
        description: 'N/A'
      }
      this.listQuery = {
        page: 1,
        limit: 20,
        patient_id: undefined,
        amount: undefined,
        ordering: '+id'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.is_disabled = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['amount', 'description', 'created_at']
        const filterVal = ['amount', 'description', 'created_at']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const ordering = this.listQuery.ordering
      return ordering === `+${key}` ? 'ascending' : 'descending'
    },
    getRemotePatientList(query) {
      console.log(query)
      searchPatient(query).then(response => {
        if (!response.data) return
        this.patientListOptions = response.data
      })
    }
  }
}
</script>
