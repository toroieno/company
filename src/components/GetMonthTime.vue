<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        sm="3"
      >
        <v-date-picker
          v-model="dates"
          range
        ></v-date-picker>
      </v-col>
      <v-col
        cols="12"
        sm="3"
      >
        <v-text-field
          v-model="dateRangeText"
          label="Date range"
          prepend-icon="mdi-calendar"
          readonly
        ></v-text-field>
        <!-- model: {{ dates }} -->
        
        <v-btn color="primary" @click="chooseRangeDate()">Choose range date</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <v-data-table
          :headers="headers"
          :items="data"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from 'axios'

  export default {
    data: () => ({
      dates: ['2019-09-10', '2019-09-20'],
      data: [],
      headers: [
        {
          text: 'id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Name', value: 'name' },
        { text: 'Address', value: 'address' },
        { text: 'Created At', value: 'created_at' },
        { text: 'Updated At', value: 'updated_at' },
      ],
    }),
    computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    methods: {
      async chooseRangeDate() {
        let startDay = new Date(this.dates[0])
        let endDay = new Date(this.dates[1])
        startDay.setHours(0,0,0,0)
        endDay.setHours(0,0,0,0)
        
        startDay = startDay.toISOString()
        endDay = endDay.toISOString()

        const result = await axios.get(`http://192.168.4.166:8000/api/companies`, {start_date: startDay, end_date: endDay})
        this.data = result.data
      }
    },
  }
</script>