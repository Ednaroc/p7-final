<template>
  <v-container id="topElement"> 
    <v-row>
      <v-col cols="2" class="hidden-sm-and-down">
        <v-sheet v-if="userActive" rounded="lg">
          <v-list>
            <v-list-item
              :title="userActive"
              subtitle="Logged in"
            >
              <template v-slot:prepend>
                <v-avatar class="mt-4" color="blue-grey-lighten-2"></v-avatar>
              </template>
            </v-list-item>
          </v-list>
          <div class="activeUser">
            <!-- <p>{{ userActive }}</p> -->
            <!-- <p>{{ userActive.name }}</p>
            <h3>My activity:</h3>
            <p>{{ handleUserInfoPost }} created</p>
            <p>{{ handleUserInfoVisited }} read</p>
            <p>{{ handleUserInfoComment }} added</p>
            <p>{{ handleUserInfoReaction }} added</p> -->
            <!-- <p>Our network has {{network.totalPostsCreated}} posts</p> -->
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="search">
            <input type="text" v-model="search">
            <p>Search term - {{ search }}</p>
            <button @click="searchResult">Search</button>
          </div>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet rounded="lg" class="text-center">
          <h1>{{ networkName }} Homepage</h1>
          <p class="description">
            Welcome to our new internal social network {{ networkName }}!
            <br>Enjoy posting content and adding your comments.
          </p>
        </v-sheet>
        <v-divider class="my-2"></v-divider>
        <v-sheet rounded="lg" class="text-center">
          <div v-if="!userActive" class="text-center">
            Please log in or sign up. {{ userActive }}
          </div>
        </v-sheet>
        <v-sheet rounded="lg">
          <div v-if="error">{{ error }}</div>
    
          <!-- conditionaly output template while fechting data -->
          <div v-if="posts.length">
              <PostList v-if="showPosts" :posts="posts"/>
          </div>
          <!-- <div v-else>Loading posts...</div> -->

        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import PostList from '../components/PostList.vue'
import getPosts from '../composables/getPosts'
import { computed, watch } from '@vue/runtime-core'
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
    name: 'HomeView',
    components: { PostList },


    computed: {

      // ...mapGetters(['user']),
      ...mapGetters({userActive: "StateUser"}),

      handleUserInfoPost() {
        const total = this.userActive.post.length;
        return (total > 1 ? `${total} posts` : total ==1 ? `${total} post` : `0 post`)
      },
      handleUserInfoVisited() {
        const total = this.userActive.Visiteds.length;
        return (total > 1 ? `${total} posts` : total ==1 ? `${total} post` : `0 post`)
      },
      handleUserInfoComment() {
        const total = this.userActive.Comments.length;
        return (total > 1 ? `${total} comments` : total ==1 ? `${total} comment` : `0 comment`)
      },
      handleUserInfoReaction() {
        const total = this.userActive.UserPostReactions.length;
        return (total > 1 ? `${total} reactions` : total ==1 ? `${total} reaction` : `0 reaction`)
      },
    },

    setup(props) {
      const networkName = ref('Grouponect');
      const search = ref('')
      watch(search, () => {})

      // const post = ref({})
      const searchResult = () => {
        // const post = ref({})
        for (props.post in posts) {
          if (props.post.tag.includes(search.value)) {
            // post.value.search = 'filtered'
            console.log(props.post.id)
          }
        }
      }
      // const matchingPost = computed(() => {
      //   return 
      // })


      // Axios GET request to fetch all posts
      const { posts, error, load } = getPosts()
      load()


      // Hide or show all posts
      const showPosts = ref(true)

      return {
        networkName, showPosts,
        posts, error,
        search, searchResult
      }
    }

}
</script>

<style>

</style>
