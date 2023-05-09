<template>
    <div v-if="error">{{ error }}</div>

    <!-- <div v-if="post" class="post"> -->
    <v-card
        v-if="post" class="post pa-6 mx-auto my-3"
        max-width="800"
    >
    
        <div class="post__info">
            <!-- <p>{{ totalPost }} created</p> -->
            <p>{{ post.user.name }}  -</p>
            <p>{{ timeElapsed }}</p>
            <!-- <p>{{ this.$route.params.curr }}</p> -->
        </div>

        <div class="post__details">
            <h2>{{ post.title }}</h2>
            <p class="pre">{{ post.post_body }}</p>
            <div class="media">
                <img :src="post.file_url" :alt="post.alt_text">
            </div>
            <span v-for="tag in post.tags" :key="tag">
                #{{ tag }}
            </span>
        </div>

        <v-dialog
            v-model="showModalDelete"
            persistent
            width="auto"
        >
            <v-card>
                <v-card-text>
                Are you sure you want to delete this post?
                </v-card-text>
                <p class="text-center">{{ submitMessage }}</p>
                <v-card-actions class="justify-end">
                    <v-btn @click="showModalDelete = false" v-show="showButton">Cancel</v-btn>
                    <v-btn variant="tonal" @click="handleDeletePost" v-show="showButton">Yes, delete</v-btn>
                    <v-btn @click="router.push('/')" v-show="!showButton">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="showModalEdit"
            persistent
            max-width="800"
        >
            <v-card>
                <v-card-title>
                    <span class="text-h5">Edit your post</span>
                </v-card-title>
                <v-card-item>
                    <v-form @submit.prevent="handleEditPostMedia">
                        <v-text-field
                            v-model="form.title"
                            clearable
                            required
                            label="Title"
                        ></v-text-field>
                        <v-textarea
                            v-model="form.body"
                            clearable
                            auto-grow
                            required
                            label="Content"
                        ></v-textarea>
                        <v-divider></v-divider>
                        <p class="py-2">Post multimedia</p>
                        <v-file-input
                            @change="handleFileUpload"
                            prepend-icon=""
                            prepend-inner-icon="mdi-paperclip"
                            label="File input"
                        ></v-file-input>
                        <v-text-field
                            v-model="form.alt_text"
                            clearable
                            label="Alt text"
                        ></v-text-field>
                        <div class="d-flex justify-end">
                            <v-btn variant="text" class="me-4" @click="showModalEdit = false" v-show="showButton">Cancel</v-btn>
                            <v-btn type="submit" variant="tonal" v-show="showButton">Save</v-btn>
                        </div>
                    </v-form>
                </v-card-item>
                <h3>{{ submitMessage }}</h3>
                <v-card-actions class="justify-end">
                    <v-btn @click="router.push(router.go())" v-show="!showButton">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-divider></v-divider>

        <v-card-actions>
            <v-btn 
                variant="tonal"
                v-show="isAuthor()" @click="toggleModalEdit"
                >
                <!-- prepend-icon="mdi-pencil" -->
                <!-- :icon="smAndDown ? 'mdi-pencil' : false" -->
                <!-- :text="mdAndUp ? 'truc' : 'bof'" -->
                <v-icon >mdi-pencil</v-icon>
                <v-text class="hidden-sm-and-down pl-2"> Edit post</v-text>
            </v-btn>
            <!-- <v-btn prepend-icon="mdi-delete" variant="text" v-show="isAuthor()" @click="toggleModalDelete"> -->
            <v-btn prepend-icon="mdi-delete" variant="text" v-show="isAuthor()" @click="showModalDelete = true">
                Delete post
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                :prepend-icon="liked ? 'mdi-heart' : 'mdi-heart-outline'"
                @click="likePost"
                :active="liked"
            >
                <!-- {{ totalLikes }} -->
                {{ post.total_likes }}
                {{ buttonLike }}
            </v-btn>
            <v-btn
                prepend-icon="mdi-comment-text"
                :append-icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                @click="show = !show"
            >{{ comments.length }}</v-btn>
        </v-card-actions>

        <v-expand-transition>
            <div v-show="show">
                <v-divider></v-divider>
                <v-sheet class="mx-4">
                    <div class="font-weight-bold my-6 text-start">Comments</div>
                    <div v-for="com in comments" :key="com.id">
                        <Comment class="message" :com="com" :activeUser="activeUser" @refreshData="getComments"/>
                    </div>
                    <AddComment :getComments="getComments" :id="id" />
                </v-sheet>
            </div>
        </v-expand-transition>

    </v-card>
    <!-- </div> -->
    
    <div v-else>Loading post details...</div>
</template>

<script>
import axios from 'axios'
import getPost from '../composables/getPost'
// import PostAPI from '../api/posts'
// import likePost from '../composables/likePost'
// import getComments from '../composables/getComments'
import AddComment from '../components/AddComment.vue'
import Comment from '../components/Comment.vue'
import Modal from '../components/ModalPop.vue'
import NewPostForm from '../components/AddNewPost.vue'
import { reactive, ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { mapGetters } from 'vuex'
import { useStore } from 'vuex'
import { useDisplay } from 'vuetify'


export default {
    name: 'PostDetails',
    components: { AddComment, Comment, Modal, NewPostForm },
    // props: ['id', 'activeUser'],
    props: ['id'],

    // computed: {
    //   ...mapGetters({activeUser: "StateUser"}),
    // },

    setup(props) {
        const store = useStore()
        const activeUser = computed(() => store.getters.StateUser)

        const { smAndDown, mdAndUp } = useDisplay()

        const isAuthor = () => {
            if (post.value.user_id == activeUser.value) {
                return true
            } else {
                return false
            }
        }
               
        const form = reactive({
            title: null,
            body: null,
            alt_text: null
        })

        // Handles edition of the post
        const showModalEdit = ref(false)
        const toggleModalEdit = () => {
            showModalEdit.value = !showModalEdit.value
            form.title = post.value.title
            form.body = post.value.post_body
            form.alt_text = post.value.alt_text
        }

        // Handles deletion of the post
        const showModalDelete = ref(false)
        const toggleModalDelete = () => {
            showModalDelete.value = !showModalDelete.value
        }

        // Axios GET request to get post details
        const { post, error, load } = getPost(props.id)
        load()
        const totalPost = computed(() => {
            const total = post.value
            return (total)
        })

        const submitMessage = ref('')
        const showButton = ref(true)
        const router = useRouter()

  
        const file = ref(null)
        const handleFileUpload = (event) => {
            file.value = event.target.files[0]
        }

        //Axios PUT request to update the post
        function handleEditPostMedia() {

            const formData = new FormData()
            formData.append('title', form.title)
            formData.append('post_body', form.body)
            if (file.value) {
                formData.append('file', file.value)
                // const oldFilename = post.value.file_url.split('/media/')[1];
                // formData.append('oldFilename', oldFilename)
            }
            formData.append('alt_text', form.alt_text)

            axios.put('posts/' + props.id, formData, {
                withCredentials: true
            })
                .then(res => {
                    submitMessage.value = res.data.message;
                    showButton.value = false;
                })
                .catch(err => {
                    submitMessage.value = err.message;
                });
        }

        // Axios DELETE request to delete the post
        function handleDeletePost() {
            axios.delete('posts/' + props.id, {
                withCredentials: true
            })
                .then(res => {
                    submitMessage.value = res.data.message;
                    showButton.value = false;
                })
                .catch(err => {
                    submitMessage.value = err.message;
                });
        }

        // Axios GET request to get all the comments
        // const { comments, comError, comLoad } = getComments(props.id)
        // comLoad()
        const totalLikes = computed(() => {
            const total = post.value.total_likes
            return (total > 1 ? `${total} likes` : total ==1 ? `${total} like` : `0 like`)
        })

        const buttonLike = ref('')
        const liked = ref(false)
        function getReactions() {
            axios.get('posts/reactions/' + props.id, {
                withCredentials: true
            })
                .then(res => {
                    if (res.data.userPR == 1) {
                        buttonLike.value = 'Unlike';
                        liked.value = true
                    } else {
                        buttonLike.value = 'Like';
                        liked.value = false
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        }
        getReactions()

        // const { post.value.total_likes, error, load } = likePost(props.id)
        function likePost() {
        // const likePost = () => {
            if (buttonLike.value == 'Like') {
                axios.post('posts/reactions/' + props.id, 
                        { name: 'like' },
                        { withCredentials: true }
                    )
                    .then(res => {
                        post.value.total_likes = res.data.count2
                        buttonLike.value = 'Unlike',
                        liked.value = true
                    })
                    .catch(err => console.log(err));
            } else {
                // PostAPI.delete(props.id)
                axios.delete('posts/reactions/' + props.id,
                        { withCredentials: true ,
                        data: { name: 'like' }
                    })
                // { name: 'like' },
                // { withCredentials: true
                // })
                    .then(res => {
                        post.value.total_likes = res.data.count2
                        buttonLike.value = 'Like',
                        liked.value = false
                    })
                    .catch(err => console.log(err));
            }
        }

        
        
        const timeElapsed = computed(() => {
            const currentTime = ref(new Date())
            const comTime = new Date(post.value.createdAt)
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
            smAndDown, mdAndUp,
            totalPost,
            isAuthor,
            activeUser,
            post, error,
            // comments, comError,
            getReactions,
            totalLikes, buttonLike, liked,
            likePost,
            timeElapsed,
            form,
            showModalEdit, toggleModalEdit,
            showModalDelete, toggleModalDelete,
            submitMessage, showButton, router, handleFileUpload, handleEditPostMedia, handleDeletePost
        }
    },

    data() {
        return {
            comments: [],
            show: false,
            overlay: false,
            dialog: false
        }
    },
    created() {
        this.getComments();
    },
    methods: {
        async getComments() {
            axios.get(`posts/comments/${this.id}`, {
                withCredentials: true
            })
                .then(res => {
                    this.comments = res.data.data;
                })
                .catch(comError => this.comments = [{title: 'No comments found.'}])
        },
    }
}
</script>

<style lang="scss" scoped>
    .post {
        max-width: 1200px;
        margin: 0 auto;
    }
    .post p {
        color: #444;
        line-height: 1.5em;
        margin-top: 40px;
    }
    .pre {
        white-space: pre-wrap;
    }
    .form {
        padding: 0 40px;
        /* margin: 0; */
    }
    .media {
        text-align: center;
        margin: 20px 0;
        & img {
            max-height: 70vh;
            max-width: 800;
        }
    }
    
    .actions {
        border-bottom: .1rem solid lightgrey;
    }
</style>