<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="UserName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.email" placeholder="Email" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.is_active" placeholder="Status" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <el-select v-model="listQuery.is_active" placeholder="Status" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in userTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
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
      <el-table-column label="name" width="200px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.first_name }} {{ row.last_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Username" width="200px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Mobile" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.profile.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Department" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.profile.department == null ? '' : row.profile.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date_joined | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Type" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.type | userTypeFilter">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.is_active | statusFilter">
            {{ row.is_active ? 'Active' : 'Inactive' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.is_active!= true" size="mini" type="success" @click="handleModifyStatus(row, true)">
            Active
          </el-button>
          <el-button v-if="row.is_active!= false && row.id !==1" size="mini" @click="handleModifyStatus(row, false)">
            Inactive
          </el-button>
          <el-button v-if="row.id !==1" size="mini" type="danger" @click="handleModifyStatus(row,'DELETE')">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="user" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Status" prop="is_active">
          <el-select v-model="user.is_active" class="filter-item" placeholder="Please select">
            <el-option v-for="item in userTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Department" prop="department">
          <el-select v-model="user.profile.department" class="filter-item" placeholder="Please select">
            <el-option v-for="item in departments" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="Username" prop="username">
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item label="Firstname" prop="first_name">
          <el-input v-model="user.first_name" />
        </el-form-item>
        <el-form-item label="Lastname" prop="last_name">
          <el-input v-model="user.last_name" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="user.password" :type="passwordType" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="user.email" />
        </el-form-item>
        <el-form-item label="Mobile" prop="mobile">
          <el-input v-model="user.profile.mobile" />
        </el-form-item>
        <!-- <el-form-item label="Status">
          <el-select v-model="user.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item> -->
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
import { fetchUserList, updateUser, deleteUser, createUser, fetchDepartmentList } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const userTypeOptions = [
  { key: true, display_name: 'Active' },
  { key: false, display_name: 'Inactive' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const userTypeKeyValue = userTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
    },
    // userTypeFilter(status) {
    //   const statusMap = {
    //     ADMIN: 'primary',
    //     USER: 'danger'
    //   }
    //   return statusMap[status]
    // },
    typeFilter(type) {
      return userTypeKeyValue[type]
    }
  },
  data() {
    return {
      passwordType: 'password',
      tableKey: 0,
      list: null,
      departments: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        is_active: undefined,
        username: undefined,
        email: undefined,
        ordering: '+id'
      },
      importanceOptions: [1, 2, 3],
      userTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [true, false],
      showReviewer: false,
      user: {
        id: undefined,
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        profile: {
          department: '',
          mobile: ''
        },
        email: '',
        type: 'USER',
        is_active: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        'profile[mobile]': [{ required: true, message: 'mobile is required', trigger: 'change' }],
        username: [{ required: true, message: 'name is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.departmentList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchUserList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    departmentList() {
      fetchDepartmentList().then(response => {
        this.departments = response.data.items
        console.log(this.departments)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetData() {
      this.resetTemp()
      this.getList()
    },
    handleModifyStatus(row, status) {
      console.log(status)
      if (status === 'DELETE') {
        deleteUser(row).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$message({
            message: 'Success',
            type: 'success'
          })
          row.status = status
        }).catch(e => {
          console.log(e)
        })
      } else {
        const statusData = { is_active: status, id: row.id }
        updateUser(statusData).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$message({
            message: 'Success',
            type: 'success'
          })
          row.status = status
        }).catch(e => {
          console.log(e)
        })
      }
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
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        profile: {
          department: '',
          mobile: ''
        },
        email: '',
        type: 'USER',
        is_active: true
      }
      this.listQuery = {
        page: 1,
        limit: 20,
        is_active: undefined,
        username: undefined,
        email: undefined,
        ordering: '+id'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const userData = Object.assign({}, this.user)
          console.log(userData)
          createUser(userData).then(() => {
            this.getList()
            // this.list.unshift(this.user)
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
    handleUpdate(row) {
      this.user = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const userData = Object.assign({}, this.user)
          updateUser(userData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          }).catch(e => {
            console.log(e)
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
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
        const tHeader = ['first_name', 'last_name', 'email', 'mobile', 'status']
        const filterVal = ['first_name', 'last_name', 'email', 'mobile', 'is_active']
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
    }
  }
}
</script>
