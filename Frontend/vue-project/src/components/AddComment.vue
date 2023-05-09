<template>
  <div class="form pt-4">
    <!-- <form @submit.prevent="handleNewComment">
        <div class="form__field">
            <textarea name="comment" id="comment" cols="50" rows="10" required v-model="newComment" placeholder="Type in your comment"></textarea>
        </div>
    </form> -->
    <v-form ref="form" @submit.prevent="handleNewComment">
        <v-textarea
            clearable
            auto-grow
            rows="2"
            :rules="[required]"
            v-model="newComment"
            label="Write a comment"
        ></v-textarea>
        <div class="d-flex justify-end">
            <v-btn color="blue-grey-darken-1" type="submit">Post</v-btn>
        </div>
        <div v-if="submitMessage" class="error">{{ submitMessage }}</div>
    </v-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
            newComment: '',
            submitMessage: ''
        }
    },
    props: ['id', 'getComments'],
    methods: {
        required(v) {
            return !!v || 'Field is required'
        },

        async handleNewComment() {
            if (this.newComment === '') {
                return;
            }
            axios.post('http://localhost:3333/api/posts/comments/' + this.id, {
                comment_body: this.newComment
            }, {
                withCredentials: true
            })
                .then(res => {
                    this.submitMessage = res.data.message;
                    // this.newComment = '';
                    this.$refs.form.reset();
                    this.getComments();
                })
                .catch(err => {
                    this.submitMessage = err.message;
                });
                
        }
    }
}
</script>

<style>

</style>