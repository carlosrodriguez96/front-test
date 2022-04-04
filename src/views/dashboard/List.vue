<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar color="primary" flat>
            <v-toolbar-title class="white--text">
              List Bills
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              single-line
              hide-details
              solo
              flat
              class="mx-4"
              color="primary"
            ></v-text-field>
          </v-toolbar>
          <v-card-text>
            <v-skeleton-loader              
              type="table" v-if="items.length < 1"
            ></v-skeleton-loader>
            <v-data-table :headers="headers" :items="items" :search="search" v-else>
              <template v-slot:item.details="{ item }">
                <v-btn class="ma-2" color="primary" text @click="goToDetails(item.id)">
                  <v-icon> mdi-open-in-new </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import billService from "@/services/billService.js";
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "ID",
          value: "id",
        },
        { text: "Sender name", value: "sender_name" },
        { text: "Sender nit", value: "sender_nit" },
        { text: "Customer name", value: "customer_name" },
        { text: "Customer nit", value: "customer_nit" },
        { text: "Amount to pay", value: "amount_to_pay" },
        { text: "Details", value: "details" },
      ],
      items: [],
    };
  },
  created() {
    this.getBills();
  },
  methods: {
    getBills() {
      var options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("tokenUser"),
        },
      };
      billService
        .getBills(options)
        .then((response) => {
          console.log(response);
          if (response.data.status == 200) {
            this.items = response.data.data;
          }
          if (response.data.status == 401) {
              localStorage.removeItem('tokenUser');
              this.$router.push({ path: "/login" })
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    goToDetails(id){
        this.$router.push({ path: "/bill/" +id })
    }
  },
};
</script>