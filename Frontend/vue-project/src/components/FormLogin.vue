<template>
    <v-card class="mx-auto px-6 py-8 my-6" max-width="344">
      <v-form
        v-model="form"
        @submit.prevent="handleLogin"
      >
        <v-text-field
          v-model="email"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Email"
          placeholder="name@example.com"
          type="email"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="[required]"
          clearable
          label="Password"
          placeholder="Enter your password"
          type="password"
        ></v-text-field>

        <br>

        <v-btn
          :disabled="!form"
          block
          size="large"
          type="submit"
          variant="elevated"
        >
          Log In
        </v-btn>

        <div v-if="submitMessage" class="error">{{ submitMessage }}</div>
        
      </v-form>
    </v-card>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            form: false,
            email: '',
            password: '',
            submitMessage: ''
        }
    },

    methods: {
        required (v) {
            return !!v || 'Field is required'
        },

        async handleLogin() {
            const { email, password } = this;
            axios.post('auth/login', {
                    email, password
                }, {
                    withCredentials: true
                })
                .then(res => {
                    this.$store.dispatch('userHandling', res.data.sessionUserId)
                    this.$router.push('/');
                })
                .catch(err => {
                    this.submitMessage = err.message;
                });
        }
    }
}
</script>