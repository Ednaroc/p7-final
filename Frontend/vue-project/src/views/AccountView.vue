<template>
    <div v-if="userActive" class="account">
        <v-sheet
            elevation="8"
            max-width="600"
            rounded="lg"
            width="100%"
            class="pa-4 mx-auto"
        >
            <h2 class="text-h5 mb-6">My account</h2>
            <!-- <p class="mb-4 text-medium-emphasis text-body-2">Test</p> -->
            <p>Name: {{ userInfo.name }}</p>
            <p>Email: {{ userInfo.email }}</p>
            <!-- <p>{{ userInfo.post }} Posts created</p> -->
            <!-- <p>{{ totalCalculation.postRead.nb }}</p> -->
            <!-- const total = userInfo.value -->
            <!-- <p>{{ totalPost.post.length }} created</p> -->
            <!-- const total = userInfo.value.post.length -->

            <v-divider class="my-4"></v-divider>
            <h2 class="text-h5 mb-6">My activity</h2>
            <!-- <p>{{ handleUserInfoPost }} created</p> -->
            <p>{{ totalCalculation.postCreated.text }} created</p>
            <p>{{ totalCalculation.postRead.text }} read</p>

            <!-- <p>{{ totalPostCreated }} created</p> -->
            <!-- <p>{{ totalPostRead }} read</p> -->
            <!-- <p>{{ totalComCreated }} added</p> -->

        </v-sheet>
    </div>
    <div v-else>
        <p>Please log in or sign up.</p>
    </div>
</template>

<script>
import { computed, ref, reactive } from 'vue'
import getUser from '../composables/getUser'
import { useStore } from 'vuex'
import { mapGetters } from 'vuex'

export default {
    name: 'AccountView',
    
    data() {
        return {
            userInfo: [],
            bidule: [],
            totalCalculation: {
                postCreated: { nb: null, text: null },
                postRead: { nb: null, text: null },
            }
        }
    },

    computed: {
      ...mapGetters({userActive: "StateUser"}),

        handleUserInfoPost() {
            const total = this.userInfo.post.length;
            return (total > 1 ? `${total} posts` : total ==1 ? `${total} post` : `0 post`)
        },
    },

    created() {
        this.getActiveUser(this.userActive)
    },

    methods: {
        async getActiveUser(id) {
            axios.get('http://localhost:3333/api/auth/user/' + id, {
            withCredentials: true
        })
            .then(response => {
                this.userInfo = response.data.user;
                var total = this.userInfo.post.length;
                this.totalCalculation.postCreated.text = total > 1 ? `${total} posts` : total ==1 ? `${total} post` : `0 post`;
                this.totalCalculation.postCreated.nb = total;
                total = this.userInfo.Visiteds.length;
                this.totalCalculation.postRead.text = total > 1 ? `${total} posts` : total ==1 ? `${total} post` : `0 post`;
                this.totalCalculation.postRead.nb = total;
            })
            .catch(error => error.value = 'No user found.')
        }
    }
}
</script>

<style>

</style>