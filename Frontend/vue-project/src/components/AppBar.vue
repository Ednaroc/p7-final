<template>
    <v-app-bar
      app
      class="px-3"
      color="white"
      elevation="3"  
    >
      <!-- <template v-slot:prepend> -->
        <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <!-- </template> -->

      <v-spacer class="hidden-md-and-up"></v-spacer>

      <v-toolbar-title>
        <router-link to="/">
          <v-img src="/images/logo/icon-left-font.png" max-height="250" alt="Logo Groupomania"></v-img>
        </router-link>
      </v-toolbar-title>

      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->

      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <!-- <div v-if="isLoggedIn">Vuex test</div> -->
      <v-tabs
        centered
        color="grey-darken-2"
        class="hidden-sm-and-down"
      >
        <div v-if="user">
          <v-tab :to="{ name: 'home' }">Home</v-tab>
          <v-tab :to="{ name: 'newpost' }">New Post</v-tab>
          <v-tab :to="{ name: 'account' }">My Account</v-tab>
          <v-tab id="truc" @click="handleLogout">Log Out</v-tab>
        </div>
        <div v-else>
          <v-tab :to="{ name: 'home' }">Home</v-tab>
          <v-tab :to="{ name: 'signup' }">Sign Up</v-tab>
          <v-tab :to="{ name: 'login' }">Log In</v-tab>
        </div>
      </v-tabs>

    </v-app-bar>

    <v-navigation-drawer
      class="hidden-md-and-up"
      v-model="drawer"
    >
    <div v-if="user">
      <v-list>
        <v-list-item
          :title="user"
          subtitle="Logged in"
        >
          <template v-slot:prepend>
            <v-avatar class="mt-4" color="blue-grey-lighten-2"></v-avatar>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" class="text-left" nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.value"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
        ></v-list-item>
        <!-- <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item> -->
      </v-list>

      <v-divider></v-divider>
      <v-list-item class="text-left" @click="handleLogout" prepend-icon="mdi-logout" title="Log Out" value="logout"></v-list-item>
    </div>
    <div v-else>
      <v-list density="compact" nav class="text-left">
        <v-list-item
          v-for="item in navItems2"
          :key="item.value"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
        ></v-list-item>
      </v-list>
    </div>
    </v-navigation-drawer>
</template>

<script>
import { ref } from '@vue/reactivity'
import { onBeforeMount } from '@vue/runtime-core'
import checkSession from '../composables/checkSession'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'AppBar',

  data () {
      return {
        drawer: false,
        navItems: [
          { title: 'Home', path: '/', icon: 'mdi-view-dashboard', value: 'home' },
          { title: 'New Post', path: '/newpost', icon: 'mdi-plus-circle', value: 'newpost' },
          { title: 'My Account', path: '/account', icon: 'mdi-account', value: 'account' },
          // { title: 'Log Out', path: '', icon: 'mdi-logout', value: 'logout' }
          // { title: '', path: '', icon: '', value: '' },
        ],
        navItems2: [
          { title: 'Home', path: '/', icon: 'mdi-view-dashboard', value: 'home' },
          { title: 'Sign Up', path: '/signup', icon: 'mdi-account-plus', value: 'signup' },
          { title: 'Log In', path: '/login', icon: 'mdi-login', value: 'login' },
        ]
      }
  },

  computed: {
    ...mapGetters(['user']),
    // isLoggedIn : function() { return this.$store.getters.isAuthenticated }
  },

  methods: {
    async handleLogout() {
      axios.post('auth/logout', {
        withCredentials: true
      })
        .then(res => {
          // localStorage.removeItem('sessionUserId');
          // this.userActive = null;
          this.$store.dispatch('userHandling', null);
          this.$router.push('/login')
        })
        .catch(err => console.log(err))
    },

    // Logout function with Vuex
    // // ...mapActions([LogOut]),
    // async handleLogout() {
    //   try {
    //     await this.$store.dispatch('LogOut')
    //     // await this.LogOut()
    //     this.$router.push('/login')
    //   } catch (err) { console.log(err) }
    // }

  }
}
</script>

<style lang="scss" scoped>
#truc {
  margin: 0;
}
</style>