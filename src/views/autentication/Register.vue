<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container fluid class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" md="4">
          <v-card class="mx-auto" elevation="1">
            <v-toolbar color="primary" flat class="white--text">
              <v-toolbar-title>Register</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  prepend-inner-icon="mdi-account"
                  label="Name"
                  required
                  clearable
                  v-model="name"
                ></v-text-field>
                <v-text-field
                  prepend-inner-icon="mdi-gmail"
                  label="Email"
                  required
                  clearable
                  v-model="email"
                  :rules="emailRules"
                ></v-text-field>
                <v-text-field
                  prepend-inner-icon="mdi-lock"
                  name="input-10-1"
                  label="Password"
                  required
                  counter
                  clearable
                  v-model="password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn depressed color="primary" @click="register()">
                Register
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
import autenticationService from "@/services/autenticationService.js";
export default {
  name: "Login",
  data: () => ({
    overlay: false,
    color: "",
    text: "",
    alert: false,
    show1: false,
    valid: true,
    name: "",
    email: "",
    password: "",
    emailRules: [
      (v) => !!v || "Correo electronico es requerido",
      (v) => /.+@.+\..+/.test(v) || "El correo electronico debe ser válido",
    ],
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Mínimo 8 caracteres",
      emailMatch: () =>
        `El correo electrónico y la contraseña que ingresaste no coinciden`,
    },
  }),
  methods: {
    register: function () {
      this.overlay = true;
      var data = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      autenticationService
        .register(data)
        .then((response) => {
          console.log(response);
          if (response.status === 201) {
            //if (response.data.status == 401) {
            this.overlay = false;
            (this.color = "error"), (this.text = "User created");
            this.alert = true;
            localStorage.setItem(
              "tokenUser",
              response.data.api_token
            );
            this.overlay = false;
            setTimeout(() => {
              this.$router.push({ path: "/" });
            }, 1000);            
          } else {
            this.overlay = false;
            //alert("Error de autenticacion");
          }
        })
        .catch(function (error) {
          this.overlay = false;
          this.color = "error";
          this.text = error;
          this.alert = true;
          console.error(error);
        });
    },
  },
};
</script>