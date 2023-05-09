<template>
    <div  class="login">
        <!-- <h1>Login Page</h1> -->
        <LoginForm />
    </div>
</template>

<script>
// import { ref } from '@vue/reactivity'
import LoginForm from '../components/FormLogin.vue'
export default {
    name: 'LoginView',
    components: { LoginForm }
}

</script>