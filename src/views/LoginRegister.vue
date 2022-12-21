<template>
  <div id="app">
    <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
      <div>
        <v-tabs
          v-model="tab"
          show-arrows
          background-color="deep-purple accent-4"
          icons-and-text
          dark
          grow
        >
          <v-tabs-slider color="purple darken-4"></v-tabs-slider>
          <v-tab v-for="i in tabs" :key="i">
            <v-icon large>{{ i.icon }}</v-icon>
            <div class="caption py-1">{{ i.name }}</div>
          </v-tab>
          <v-tab-item>
            <v-card class="px-4">
              <v-card-text>
                <v-form ref="loginForm" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="loginAccount"
                        :rules="loginEmailRules"
                        label="E-mail"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="loginPassword"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        label="Password"
                        hint="At least 8 characters"
                        counter
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="6" xsm="12"> </v-col>
                    <v-spacer></v-spacer>
                    <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                      <v-btn
                        x-large
                        block
                        :disabled="!valid"
                        color="success"
                        @click="validate"
                      >
                        Login
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card class="px-4">
              <v-card-text>
                <v-form ref="registerForm" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userName"
                        :rules="[rules.required]"
                        label="Name"
                        maxlength="20"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="phone"
                        :rules="phoneRules"
                        label="Phone Number"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        label="Password"
                        hint="At least 8 characters"
                        counter
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        block
                        v-model="verify"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, passwordMatch]"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        label="Confirm Password"
                        counter
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        :key="'id'"
                        v-model="companyId"
                        :items="companies"
                        label="Company"
                        item-text="name"
                        item-value="id"
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="department_id"
                        :items="departments"
                        label="Department"
                        item-text="name"
                        item-value="id"
                      >
                      </v-select>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                      <v-btn
                        x-large
                        block
                        :disabled="!valid"
                        color="success"
                        @click="validate"
                        >Register</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import {
  LoginUser,
  getAllDepartments,
  CreateUser,
  getAllCompanies,
} from "@/backend";

export default {
  data: () => ({
    dialog: true,
    tab: 0,
    tabs: [
      { name: "Login", icon: "mdi-account" },
      { name: "Register", icon: "mdi-account-outline" },
    ],
    valid: true,

    departments: [],
    companies: [],
    userName: "",
    email: "",
    phone: null,
    password: "",
    department_id: "",
    companyId: "",
    verify: "",
    loginPassword: "",
    loginAccount: "",
    loginEmailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    emailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    phoneRules: [
      (v) => !!v || "Required",
      (v) => /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(v) || "Phone must be valid",
    ],

    show1: true,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => (v && v.length >= 8) || "Min 8 characters",
    },
  }),

  async created() {
    this.getCompanies();
  },

  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    },
    registerData() {
      return {
        name: this.userName,
        email: this.email,
        phone_number: this.phone,
        department_id: this.department_id,
        password: this.password,
      };
    },
    loginData() {
      return {
        email: this.loginAccount,
        password: this.loginPassword,
      };
    },
  },

  watch: {
    companyId(){
      this.getDepartments()
    }
  },

  methods: {
    async getCompanies() {
      const allCompanies = await getAllCompanies();

      this.companies = allCompanies.data;
    },
    async getDepartments() {
      const result = await getAllDepartments({company_id: this.companyId});
      this.departments = result.data;
    },
    async validate() {
      if (this.$refs.loginForm.validate()) {
        // submit form to server/API here...
        console.log("login");
        const result = await LoginUser(this.loginData);
        if (result.data.message === "success") {
          this.$router.push({ path: `/companies` });
        } else {
          alert("ddd");
        }
      }
      if (this.$refs.registerForm.validate()) {
        console.log("logout");
        console.log(this.department_id);
        const result = await CreateUser(this.registerData);
        if (result.data.message === "success") {
          this.$router.push({ path: `/companies` });
        } else {
          alert("ddd");
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
