<template>
  <v-app>
    <v-main>
      <!-- <GetMonthTime/> -->
      <DataTable />
    </v-main>
  </v-app>
</template>

<script>
// import GetMonthTime from '@/components/GetMonthTime.vue';
import DataTable from './components/DataTable.vue';

export default {
  name: 'App',
  components: {
    // GetMonthTime,
    DataTable,
  },
};
</script>
