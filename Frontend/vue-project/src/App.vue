<template>
  <v-app>
    <default-bar />

    
    <v-main class="bg-grey-lighten-3">
      <router-view />
    </v-main>


    <v-footer class="footer">
      <p>{{ copyright }}</p>
    </v-footer>
  </v-app>
</template>

<script>
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import checkSession from './composables/checkSession'
import DefaultBar from './components/AppBar.vue'
import axios from 'axios'

export default {
  components: { DefaultBar },

  setup() {
    const networkName = ref('Grouponect')
    const copyright = computed(() => {
      const currentYear = ref(new Date().getFullYear())
      return `Copyright ${networkName.value} ${currentYear.value}`
    })

    return {
      networkName, copyright,

    }
  },
}
</script>

<style lang="scss">
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  // margin-top: 60px;
}
// body {
//   // margin: 0;
//   // background: #eee;
// }
// nav {
//   padding: 30px;
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//     text-decoration: none;
//     padding: 10px;
//     border-radius: 4px;
//     &:hover {
//       background: #bb4e56;
//     }
//     &.router-link-exact-active {
//       color: white;
//       background: crimson;
//     }
//   }
// }

// button {
//   background: #0faf87;
//   color: white;
//   border: none;
//   padding: 8px 16px;
//   border-radius: 4px;
//   font-size: 16px;
//   letter-spacing: 1px;
//   cursor: pointer;
//   margin: 10px;
//   &[disabled] {
//     opacity: 0.2;
//     cursor: not-allowed;
//   }
// }

// .header {
//   background: white;
//   border-bottom: .1rem solid lightgrey;
//   /* margin-bottom: 50rem; */
//   height: 5rem;
//   width: 100%;
//   position: fixed;
//   top: 0;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   &__logo img {
//     max-height: 10vh;
//   }
// }

// .footer {
//   background: white;
//   border-top: .1rem solid lightgrey;
//   height: 3rem;
// }
</style>
