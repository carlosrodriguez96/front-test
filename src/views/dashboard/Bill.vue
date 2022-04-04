<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
            <v-toolbar color="primary" flat>
            <v-toolbar-title class="white--text">
              Edit Bill
            </v-toolbar-title>            
          </v-toolbar>
          <v-skeleton-loader              
              type="table" v-if="bill < 1"
            ></v-skeleton-loader>
            <v-card-text v-else>
                  <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Nombre Emisor"
                    required
                    v-model="bill.sender_name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Nit Emisor"
                    v-model="bill.sender_nit"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Nombre Cliente"
                    required
                    v-model="bill.customer_name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Nit Cliente"
                    v-model="bill.customer_nit"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Valor base"
                    required
                    readonly
                    v-model="bill.value"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="IVA"
                    readonly
                    v-model="bill.iva"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Valor a pagar"
                    readonly
                    v-model="bill.amount_to_pay"
                  ></v-text-field>
                </v-col>
              </v-row>
               <v-data-table
                      :headers="headers"
                      :items="items"
                    ></v-data-table>
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
      bill: "",
      items: [],
       headers: [
        {
          text: "Description",
          align: "start",

          value: "description",
        },
        { text: "Unit value", value: "unit_value" },
        { text: "quantity", value: "quantity" },
        { text: "Total value", value: "total_value" },
      ],
    };
  },
  created() {
      this.getById();
  },
  methods: {
    /**
     * function that brings the invoice by id
     */
    getById() {
      let id = this.$route.params.id;
      var options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("tokenUser"),
        },
      };
      billService.getBillById(id,options)
      .then((response)=>{          
          this.bill = response.data.data;
          this.items = this.bill.items;
            if (response.data.status == 401) {
              localStorage.removeItem('tokenUser');
              this.$router.push({ path: "/login" })
          }
      })
      .catch((error)=>{
          console.log(error);
      })
    },
  },
};
</script>