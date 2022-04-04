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
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>              
              <v-form ref="form" v-model="valid" lazy-validation>
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
                  label="Passsword"
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
              <v-btn depressed color="primary" @click="login()"> Login </v-btn>
              <v-btn to="/register" text color="primary">Register </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" timeout="2000" top :color="color">
      {{ text }}
    </v-snackbar>
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
    snackbar: false,
    show1: false,
    valid: true,
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
    //function for user login
    login: function () {
      this.overlay = true;
      var data = {
        email: this.email,
        password: this.password,
      };
      autenticationService
        .login(data)
        .then((response) => {
         
          if (response.data.status=== 200) {
            this.overlay = false;
            localStorage.setItem("tokenUser", response.data.data.api_token);
            this.color = "success";
            this.text = response.data.message;
            this.snackbar = true;
            setTimeout(() => {
              this.$router.push({ path: "/" });
            }, 1000);
          } else {
            this.overlay = false;

            this.color = "error";
            this.text = response.data.message;
            this.snackbar = true;
          }
        })
        .catch(function (error) {
          this.overlay = false;
          
          console.error(error);
        });
    },
  },
};
</script>