<template>
  <v-container>
    <v-text-field label="Search" v-model="search" outlined> </v-text-field>
    <v-row>
      <v-col cols="12" sm="4">
        <v-select
          :items="name"
          label="Filter Name"
          outlined
          v-model="filterName"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          :items="address"
          label="Filter address"
          outlined
          v-model="filterAddress"
        ></v-select>
      </v-col>
    </v-row>
    <v-row justify-self="center" align-self="center">
      <v-col cols="12" sm="4">
        <v-menu
          ref="menu_start"
          v-model="menu_start"
          :close-on-content-click="false"
          :return-value.sync="start_date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="start_date"
              label="Start date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="start_date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu_start = false">
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.menu_start.save(start_date)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <!-- <v-icon>mdi-calendar</v-icon> -->
      </v-col>
      <v-col cols="12" sm="4">
        <v-menu
          ref="menu_end"
          v-model="menu_end"
          :close-on-content-click="false"
          :return-value.sync="end_date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="end_date"
              label="End date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="end_date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu_end = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.menu_end.save(end_date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn @click="chooseRangeDate()">choose range date</v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="companies"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Company</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Company
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.address"
                        label="Address"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getData"> Reset </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    menu_start: false,
    menu_end: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Id",
        align: "start",
        value: "id",
      },
      { text: "Name", value: "name" },
      { text: "Address", value: "address" },
      { text: "Created At", value: "created_at" },
      { text: "Updated At", value: "updated_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    companies: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      address: "",
      created_at: "2022-12-16T17:21:53.000000Z",
      updated_at: "2022-12-16T17:21:53.000000Z",
    },
    defaultItem: {
      name: "",
      address: "",
    },
    host: "http://127.0.0.1:8000",
    search: "",
    start_date: "",
    end_date: "",
    name: [],
    address: ["ha noi", "thanh hoa", "nam dinh", "nghe an", "thai nguyen"],
    filter_address: "",
    filter_name: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Company" : "Edit Company";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    search() {
      const _this = this;
      this.debounce(() => _this.searchInfo())();
    },
    filterAddress() {
      const param = `?address=${this.filterAddress}`;
      this.getData(param);
    },
    filterName() {
      const param = `?name=${this.filterName}`;
      this.getData(param);
    },
  },

  created() {
    this.getData();
  },
  methods: {
    async getData(param = "") {
      let http = `${this.host}/api/companies`;
      if (param) {
        http += param;
      }
      const result = await axios.get(http);
      console.log("result get data: ", result.data);
      this.companies = result.data;
      this.handleFormatDate();
      this.handleFilterDuplicate();
    },

    handleFormatDate() {
      const _this = this;
      this.companies.forEach((company) => {
        company.created_at = _this.formatDate(company.created_at);
        company.updated_at = _this.formatDate(company.updated_at);
      });
    },

    handleFilterDuplicate() {
      const _this = this;
      this.companies.forEach((company) => {
        _this.name.push(company.name);
      });
      this.companies.forEach((company) => {
        _this.address.push(company.address);
      });
      const filter_name = this.name.filter((value, index) => {
        return _this.name.indexOf(value) === index;
      });
      const filter_address = this.address.filter((value, index) => {
        return _this.address.indexOf(value) === index;
      });
      this.name = filter_name;
      this.address = filter_address;
    },

    editItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItemConfirm() {
      await axios.delete(`${this.host}/api/companies/${this.editedIndex}`);
      this.getData();
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      const data = {
        name: this.editedItem.name,
        address: this.editedItem.address,
      };
      if (this.editedIndex > -1) {
        await axios.put(`${this.host}/api/companies/${this.editedIndex}`, data);
      } else {
        await axios.post(`${this.host}/api/companies`, data);
      }
      this.getData();
      this.close();
    },

    debounce(func, timeout = 800) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    },

    async searchInfo() {
      const param = `?search=${this.search}`;
      this.getData(param);
    },

    formatDate(date) {
      let arrDate = date.split("-");
      const year = arrDate[0];
      const month = arrDate[1];
      const day = arrDate[2].substr(0, 2);
      return `${year}-${month}-${day}`;
    },

    chooseRangeDate() {
      let startDate = new Date(this.start_date);
      let endDate = new Date(this.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      startDate = startDate.toISOString();
      endDate = endDate.toISOString();
      console.log("s", startDate);
      console.log("e", endDate);

      // const param = `?start_date=${startDate}&end_date=${endDate}`
      // this.getData(param)
    },
  },

  // async mounted() {
  //   const time = new Date()
  //   console.log('time: ', time);
  // },
};
</script>
