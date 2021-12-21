<template>
  <v-app id="inspire">
    <v-main>
      <v-container fill-height>
        <v-row align-center>
          <v-flex v-if="error" xs12 sm4 offset-sm4>
            <app-alert @dismissed="onDismissed" :text="error"></app-alert>
          </v-flex>
          <v-flex xs12 sm4 offset-sm4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                      v-model="form.email"
                      prepend-icon="email"
                      name="login"
                      label="Email"
                      type="text"
                  ></v-text-field>
                  <v-text-field
                      id="password"
                      v-model="form.password"
                      prepend-icon="lock"
                      name="password"
                      label="Password"
                      type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="pink white--text" @click="login">
                  <v-icon>
                    login
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        email: '',
        password: '',
      }
    }
  },
  methods: {
    login() {
      this.$store.dispatch('user/login', this.form)
    },
    onDismissed() {
      this.$store.dispatch('user/clearError')
    }
  },
  computed: {
    error() {
      return this.$store.getters['user/error']
    }
  }
}
</script>

<style scoped>

</style>