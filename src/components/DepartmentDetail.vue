<template>
  <v-container>
    <v-text-field
      label="Search"
      v-model="search"
      outlined
    >
    </v-text-field>
    <v-data-table
      :headers="headers"
      :items="departments"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>{{nameCompany}}</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-row justify-self="center" align-self="center">
            <v-col
              cols="12"
              sm="4"
            >
              <v-menu
                bottom
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field 
                      v-bind="attrs"
                      v-on="on"
                      label="start date" 
                      v-model="start_date"
                      prepend-icon="mdi-calendar"
                    >
                    </v-text-field>
                </template>
                <v-date-picker
                    v-model="start_date"
                  ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
            <v-menu
              bottom
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field 
                  v-bind="attrs"
                  v-on="on"
                  label="end date" 
                  v-model="end_date"
                  prepend-icon="mdi-calendar"
                >
                </v-text-field>
              </template>
              <v-date-picker
                v-model="end_date"
              ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <v-btn @click="chooseRangeDate()">choose range date</v-btn>
            </v-col>
          </v-row>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New Department
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="12"
                      md="12"
                    >
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          class="mr-2"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
        <v-icon
          small
          @click="showInfoDepartment(item.id)"
        >
          mdi-information
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="getData"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

  export default {
    data: () => ({
      nameCompany: '',
      dialog: false,
      dialogDate: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Id',
          align: 'start',
          value: 'id',
        },
        { text: 'Name', value: 'name' },
        { text: 'Created At', value: 'created_at' },
        { text: 'Updated At', value: 'updated_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      departments: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        address: '',
        created_at: '',
        updated_at: ''
      },
      defaultItem: {
        name: '',
        address: '',
      },
      host: 'http://127.0.0.1:8000',
      search: '',
      start_date: '',
      end_date: '',
      name: [],
      filterName: '',
      id_company: null,
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Department' : 'Edit Department'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
      search(){
        const _this = this
        this.debounce(() => _this.searchInfo())()
      },
      filterAddress(){
        const param = `?address=${this.filterAddress}`
        this.getData(param)
      },
      filterName(){
        const param = `?name=${this.filterName}`
        this.getData(param)
      }
    },

    created () {
      this.getData()
    },

    methods: {
      async getData (param = '') {
        // let http = `${this.host}/api/departments`
        let http = `${this.$store.state.test_host}/api/departments`
        if (param){
          http += param
        }
        const result = await axios.get(http)
        console.log('result get data: ', result.data);
        this.departments = result.data
        this.handleFormatDate()
        this.handleFilterDuplicate()
      },

      handleFormatDate(){
        const _this = this
        this.departments.forEach((department) => {
          department.created_at = _this.formatDate(department.created_at)
          department.updated_at = _this.formatDate(department.updated_at)
        })
      },

      handleFilterDuplicate() {
        const _this = this
        this.companies.forEach(company => {
          _this.name.push(company.name)
        })
        this.companies.forEach(company => {
          _this.address.push(company.address)
        })
        const filter_name = this.name.filter((value, index) => {
          return _this.name.indexOf(value) === index
        })
        const filter_address = this.address.filter((value, index) => {
          return _this.address.indexOf(value) === index
        })
        this.name = filter_name
        this.address = filter_address
      },

      editItem (item) {
        this.editedIndex = item.id
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = item.id
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        // await axios.delete(`${this.host}/api/companies/${this.editedIndex}`)
        await axios.delete(`${this.$store.state.test_host}/api/departments/${this.editedIndex}`)
        this.getData()
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      async save () {
        const data = {
          name: this.editedItem.name,
          company_id: this.id_company,
        }
        if (this.editedIndex > -1) {
          // await axios.put(`${this.host}/api/companies/${this.editedIndex}`, data)
          await axios.put(`${this.$store.state.test_host}/api/departments/${this.editedIndex}`, data)
        } else {
          // await axios.post(`${this.host}/api/companies`, data)
          await axios.post(`${this.$store.state.test_host}/api/departments`, data)
        }
        this.getData()
        this.close()
      },

      debounce(func, timeout = 800){
        let timer;
        return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
      },

      async searchInfo(){
        const param = `?search=${this.search}`
        this.getData(param)
      },

      formatDate(date){
        const formatDate = moment(date, 'YYYY-MM-DDThh:mm:ss.Z').format('YYYY-MM-DD, HH:mm:ss')
        return formatDate
      },

      chooseRangeDate() {
        let startDate = new Date(this.start_date)
        let endDate = new Date(this.end_date)
        startDate.setHours(0,0,0,0)
        endDate.setHours(24,0,0,0)
        
        startDate = startDate.toISOString()
        endDate = endDate.toISOString()

        const param = `?start_date=${startDate}&end_date=${endDate}`
        this.getData(param)
      },

      showInfoDepartment(id){
        this.$router.push({ path: `/companies/${id}`, })
      }
    },

    async mounted() {
      const path = window.location.pathname
      this.id_company = path.split('/')[2]
      const result = await axios.get(`${this.$store.state.host}/api/companies/${this.id_company}`)
      this.nameCompany = result.data.name
    },
  }
</script>