<template>
  <v-container>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar color="primary" flat>
            <v-toolbar-title class="white--text"> Create Bill </v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-container>
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
              <v-row>
                <v-divider></v-divider>
              </v-row>
              <v-row>
                <v-col>
                  <v-dialog v-model="dialog" max-width="700">
                    <v-card>
                      <v-toolbar color="primary" flat>
                        <v-toolbar-title class="white--text">
                          Add Item
                        </v-toolbar-title>
                        <v-spacer></v-spacer>

                        <v-btn icon @click="dialog = false" class="white--text">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-toolbar>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              label="Description"
                              required
                              v-model="item.description"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              label="Quantity"
                              required
                              v-model="item.quantity"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              label="Unit value"
                              required
                              v-model="item.unit_value"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn @click="addItem()"> Add </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-card>
                    <v-card-title>
                      Items
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="dialog = true"
                        >Add Items</v-btn
                      >
                    </v-card-title>
                    <v-data-table
                      :headers="headers"
                      :items="items"
                    ></v-data-table>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn @click="send()"> Save bill </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" timeout="2000" top :color="color">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>
<script>
// import service 
import billService from "@/services/billService.js";
export default {
  data() {
    return {
      dialog: false,
      overlay: false,
      snackbar: false,
      text: "",
      color: "",
      value: 0,
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
      items: [],
      item: {
        description: "",
        quantity: 0,
        unit_value: 0,
        total_value: 0,
      },
      bill: {
        sender_name: "",
        sender_nit: "",
        customer_name: "",
        customer_nit: "",
        value: 0,
        iva: 19,
        value_with_iva: 0,
        amount_to_pay: 0,
      },
    };
  },
  methods: {
    /**
     * function that allows adding items to the invoice
     */
    addItem() {
      this.item.total_value = this.item.quantity * this.item.unit_value;
      this.value = this.value + this.item.total_value;
      this.items.push(this.item);
      this.item = {
        description: "",
        quantity: 0,
        unit_value: 0,
        total_value: 0,
      };
      this.bill.value = this.value;
      this.bill.value_with_iva =
        this.value * (this.bill.iva / 100) + this.value;
      this.bill.amount_to_pay = this.bill.value_with_iva;
      this.bill.items = this.items;
    },
    send() {
      this.overlay = true;
      var options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("tokenUser"),
        },
      };
      billService
        .createBill(this.bill, options)
        .then((response) => {
          if (response.data.status == 401) {
            localStorage.removeItem("tokenUser");
            this.$router.push({ path: "/login" });
          }else if (response.data.status == 201) {
            this.overlay = false;
            this.color = "success";
            this.text = response.data.message;
            this.snackbar = true;
          } else {
            this.overlay = false;
            this.color = "error";
            this.text = response.data.message;
            this.snackbar = true;
          }
          this.clearBillData();
        })
        .catch((error) => {
          console.error(error);
          this.overlay = false;
          this.color = "error";
          this.text = error;
          this.snackbar = true;
        });
    },
    clearBillData() {
      this.bill = {
        sender_name: "",
        sender_nit: "",
        customer_name: "",
        customer_nit: "",
        value: 0,
        iva: 19,
        value_with_iva: 0,
        amount_to_pay: 0,
      };
      this.items = [];
      this.value = 0;
    },
  },
};
</script>