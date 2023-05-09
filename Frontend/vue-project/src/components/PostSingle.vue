<template>
  <v-card 
    class="mx-auto"
    max-width="600"
    :to="{ name: 'postDetails', params: { id: post.id }}"
    @click="handleRead"
    :color="classRead"
  >
    <v-img v-if="post.file_url"
      height="200"
      cover
      :alt="post.alt_text"
      :src="post.file_url"
    >
      <!-- <v-overlay contained scrim="#036358"></v-overlay> -->
    </v-img>
    <v-card-title>{{ post.title }}</v-card-title>
    <!-- <v-card-subtitle class="pt-4">Number 10</v-card-subtitle> -->

    <v-card-text>
      <div>{{ snippet }}</div>
    </v-card-text>
    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-actions>
      <v-list-item class="w-100 text-left">

        <v-list-item-title>{{ post.user.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ timeElapsed }}</v-list-item-subtitle>

        <template v-slot:append>
          <div class="justify-self-end">
            <v-icon class="me-1" icon="mdi-heart"></v-icon>
            <span class="subheading me-2">{{ post.total_likes }}</span>
            <span class="me-1">·</span>
            <v-icon class="me-1" icon="mdi-comment-text"></v-icon>
            <span class="subheading">{{ post.Comments.length }}</span>
          </div>
        </template>

      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
import { computed, ref } from '@vue/runtime-core'
import { mapGetters } from 'vuex'
import { useStore } from 'vuex'

export default {
    // props: ['post', 'activeUser'],
    props: ['post'],

    // computed: {
    //   ...mapGetters({userActive: "StateUser"}),
    // },
    

    setup(props) {
      const store = useStore()
      const userActive = computed(() => store.getters.StateUser)

      function handleRead () {
      // const handleRead = () => {
        // console.log(postId, postId.value)
        axios.post('http://localhost:3333/api/posts/read/' + props.post.id, props.post.id, {
            withCredentials: true
        })
          .then(res => {
            // console.log(res)
          })
          .catch(err => console.log(err));
      }

      const classRead = computed(() => {
        const found = props.post.Visiteds.find(({ UserId }) => UserId == userActive.value);
        if (found) {
          return 'grey-lighten-3 text-medium-emphasis'
        } else {
          return 'notread'
        }
      })

      // const classAuthor = computed(() => {
      //   if (props.post.user.id == props.activeUser) {
      //     return 'author'
      //   } else {
      //     return 'user'
      //   }
      // })

      // const isAuthor = () => {
      //   if (props.post.user.id == props.activeUser) {
      //     return true
      //   } else {
      //     return false
      //   }
      // }

      const totalLikes = computed(() => {
        const total = props.post.total_likes
        return (total > 1 ? `${total} likes` : total ==1 ? `${total} like` : `0 like`)
      })

      const totalCom = computed(() => {
        const length = props.post.Comments.length
        return (length > 1 ? `${length} comments` : `${length} comment`)
      })

      const snippet = computed(() => {
        return props.post.post_body.substring(0,200) + '...'
      })

      const timeElapsed = computed(() => {
        const currentTime = ref(new Date())
        const comTime = new Date(props.post.createdAt)
        const ms = currentTime.value - comTime
        // const seconds = Math.floor((ms/1000)%60)
        const minutes = Math.floor((ms/1000/60)%60)
        const hours = Math.floor((ms/1000/60/60))
        const days = Math.floor((ms/1000/60/60/24))
        const weeks = Math.floor((ms/1000/60/60/24/7))
        const months = Math.floor((ms/1000/60/60/24/7/30))

        if (months > 1) { return `${months} months ago` }
        else if (months == 1) { return `${months} month ago` }
        else if (weeks > 1) { return `${weeks} weeks ago`}
        else if (weeks == 1) { return `${weeks} week ago`}
        else if (days > 1) { return `${days} days ago`}
        else if (days == 1) { return `${days} day ago`}
        else if (hours > 1) { return `${hours} hours ago`}
        else if (hours == 1) { return `${hours} hour ago`}
        else if (minutes > 1) { return `${minutes} minutes ago`}
        else { return `Not long ago` }
      })

      return {
        // isAuthor, classAuthor, 
        snippet, timeElapsed,
        handleRead, classRead,
        totalCom, totalLikes}
    }
}
</script>

<style>

.post {
  border-top: .05rem solid lightgrey;
  padding-bottom: 2rem;
}
.post__title {
  /* background: #f4f4f4; */
  background: #bb4e56;
  padding: 20px;
  border-radius: 10px;
  margin: 10px auto;
  max-width: 600px;
  cursor: pointer;
  color: #444;
}
.post__title:hover {
  background: #ddd;
}
.visited {
  background: darkgrey;
}
.post a {
  text-decoration: none;
}
.post__info {
  display: flex;
  gap: 10px;
  /* align-items: left; */
  /* justify-content: space-between; */
}
.author {
  background: lightblue;
}


  /* <div class="post" ref="postId">
    <router-link :to="{ name: 'postDetails', params: { id: post.id }}" @click="handleRead">
      <div class="media">
        <!-- <img :src="post.file_url" :alt="post.alt_text"> -->
      </div>
      <div class="post__info" :class="classAuthor">
        <p>{{ post.user.name }}</p>
        <p>{{ timeElapsed }}</p>
        <button v-show="isAuthor()">Author edit</button>
      </div>
      <h2 class= "post__title" :class="classRead">{{ post.title }}</h2>
    </router-link>
    <!-- <p>{{ post.search }}</p> -->
      <p>{{ snippet }}</p>
      <span v-for="tag in post.tags" :key="tag">
        #{{ tag }}
      </span>
      <div>
        <span>{{ totalLikes }}</span>
        <span>{{ totalCom }}</span>
      </div>
  </div> */

</style>