/* eslint-disable */
<template>
  <!-- <form @submit.prevent="handleSignup">
    <div class="form__field">
        <label for="email">Email address:</label>
        <input type="email" required id="email" placeholder= "name@example.com" v-model="email">
        <div v-if="emailError" class="error">{{ emailError }}</div>
    </div>
    <div class="form__field">
        <label for="username" >Username:</label>
        <input type="text" autocomplete="username" required id="username" placeholder="Your username" v-model="username">
    </div>
    <div class="form__field">
        <label for="password-input">Set Password:</label>
        <input type="password" autocomplete="new-password" required id="password-input" v-model="password">
        <div v-if="passwordError" class="error">{{ passwordError }}</div>
    </div>
    <div class="form__field">
        <label for="password-confirm">Confirm Password:</label>
        <input @blur="handleBlur" type="password" autocomplete="new-password" required id="password-confirm" v-model="passwordConfirm">
        <small v-show="errorChecked" id="error-message">Both password fields must match.</small>
    </div>
    <div class="terms">
        <input type="checkbox" required id="terms" v-model="terms">
        <label for="terms">Accept terms and conditions</label>
    </div>
    <div v-if="submitMessage" class="error">{{ submitMessage }}</div>
    <div class="submit">
        <v-btn type="submit" :disabled="isChecked">Create an Account</v-btn>
    </div>
  </form> -->

  <v-card class="mx-auto px-6 py-8 my-6" max-width="344">
      <v-form
        v-model="form"
        @submit.prevent="handleSignup"
      >
        <v-text-field
          v-model="email"
          :rules="[rules.required, rules.email]"
          class="mb-2"
          clearable
          label="Email"
          placeholder="name@example.com"
          type="email"
        ></v-text-field>

        <v-text-field
          v-model="username"
          :rules="[rules.required, rules.length(3)]"
          class="mb-2"
          clearable
          label="Username"
          placeholder="Your username"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="[rules.required]"
          clearable
          label="Password"
          placeholder="Set your password"
          type="password"
        ></v-text-field>

        <v-text-field
          v-model="passwordConfirm"
          @blur="handleBlur"
          :rules="[rules.required]"
          :error-messages="passwordError"
          clearable
          label="Confirm Password"
          placeholder="Confirm your password"
          type="password"
        ></v-text-field>
        <!-- <small v-show="errorChecked" id="error-message">Both password fields must match.</small> -->

        <v-checkbox
            v-model="terms"
            :rules="[rules.required]"
            label="I agree to site terms and conditions"
        ></v-checkbox>

        <br>

        <v-btn
          :disabled="!form"
          block
          size="large"
          type="submit"
          variant="elevated"
        >
          Create an Account
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
            username: '',
            password: '',
            passwordConfirm: '',
            terms: false,
            passwordError: '',
            // pattern: '/\S+@\S+\.\S+/g',
            // emailError: '',
            // isChecked: true,
            // errorChecked: false,
            submitMessage: '',
            rules: {
                required: v => !!v || 'Field is required',
                email: v => !!(v || '').match(/@/) || 'Please enter a valid email: a@a.com',
                length: len => v => (v || '').length >= len || `Invalid character length, minimum required ${len}`,
            }
        }
    },

    methods: {
        handleSubmit() {
            // validate password
            this.passwordError = this.password.length > 5 ?
                '' : 'Password must be at least 6 chars long'
            // this.emailError = this.pattern.test(this.email) ?
            //     '' : 'Please enter your email address in the format: something@something.something'
        },

        // Verify that the passwords match
        handleBlur() {
            if (this.password !== this.passwordConfirm) {
                this.passwordError='Both password fields must match.'
            } else {
                this.passwordError=''
            }
        },

        async handleSignup() {
            const { email, username, password } = this;
            axios.post('auth/signup', {
                    email, name: username, password
                }, {
                    withCredentials: true
                })
                .then(res => {
                    // this.submitMessage = res.data.message;
                    // localStorage.setItem('sessionUserId', res.data.sessionUserId);
                    this.$store.dispatch('userHandling', res.data.sessionUserId)
                    this.$router.push('/');
                })
                .catch(err => {
                    this.submitMessage = err.message;
                });
            
            // const {res, err} = await axios.post('auth/signup', {
            //     email, name: username, password
            // }) ;
            // this.$store.dispatch('user', res.data.sessionUserId)
            // this.$router.push('/');
            // console.log(err);
            // this.submitMessage = err.message;
        },

        submitForm() {
            this.$emit('event-name', {
                message: 'my message'
            })
        }
    }
}
</script>

<style ang="scss" scoped>
/* form {
    max-width: 420px;
    margin: 30px auto;
    background: white;
    text-align: left;
    padding: 40px;
    border-radius: 10px;
}
label {
    color: #aaa;
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}
input, select {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
    color: #555;
}
input[type=checkbox] {
    display: inline-block;
    width: 16px;
    margin: 0 10px 0 0;
    position: relative;
    top: 2px;
}
.pill {
    display: inline-block;
    margin: 20px 10px 0 0;
    padding: 6px 12px;
    background: #eee;
    border-radius: 20px;
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: bold;
    color: #777;
    cursor: pointer;
} */
/* button {
    background: #0b6dff;
    border: 0;
    padding: 10px 20px;
    margin-top: 20px;
    color: white;
    border-radius: 20px;
} */
/* .submit {
    text-align: center;
} */
.error {
    color: #ff0062;
    margin-top: 10px;
    font-size: 0.8em;
    font-weight: bold;
}
</style>