<template>
  <div class="new-post">
    <!-- <h1>Create a new post</h1> -->
    <NewPostForm />
  </div>
</template>

<script>
// import { ref } from '@vue/reactivity'
import NewPostForm from '../components/AddNewPost.vue'
// import { onMounted } from '@vue/runtime-core'
export default {
    name: 'NewPostView',
    components: { NewPostForm }
}
</script>

<style>

</style>