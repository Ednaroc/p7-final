<template>
  <div class="post-list">
    <v-col v-for="post in posts" :key="post.id" cols="12" class="deep-orange-lighten-4">
    <!-- <div v-for="post in posts" :key="post.id"> -->
        <SinglePost :post="post" />
    <!-- </div> -->
    </v-col>
  </div>
</template>

<script>
// import { onMounted } from '@vue/runtime-core'
import SinglePost from './PostSingle.vue'

export default {
    props: ['posts'],
    components: { SinglePost },
    // setup(props) {
    //     onMounted(() => {
            // axios.get...
    //     })
    // },

}
</script>

<style>

</style>