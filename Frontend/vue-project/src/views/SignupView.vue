<template>
    <div class="signup">
        <!-- <h1>Sign up page</h1> -->
        <SignupForm />
    </div>
</template>

<script>
import SignupForm from '../components/FormSignup.vue'
export default {
    name: 'SignupView',
    components: { SignupForm }
}
</script>