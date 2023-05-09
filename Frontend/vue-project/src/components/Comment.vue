<template>
  <div>
    <!-- <div class="comment">
        <div class="comment__info">
            <p>{{ com.User.name }}</p>
            <p>{{ timeElapsed }}</p>
            <div class="comment__flex-btn">
                <v-btn variant="tonal" class="update" v-show="isAuthor()" @click="toggleEditComment">Edit</v-btn>
                <v-btn variant="text" class="delete" v-show="isAuthor()" @click="toggleDeleteComment">Delete</v-btn>
            </div>
        </div>
        <p>{{ com.comment_body }}</p>
    </div> -->

        <!-- <ul class="replies" v-if="replies.length">
            <div v-for="item in replies" :key="item.id">
                <recursive-comment v-bind="{com: item.com, replies: item.replies}"/>
            </div>
        </ul> -->
        
        <!-- <h3>{{ submitMessage }}</h3> -->
    
    <!-- <v-card max-width="700">
        <v-card-actions>
            <v-card-item>
                <v-card-title>{{ com.User.name }}</v-card-title>
                <span class="me-1">·</span>
                <v-card-subtitle>{{ timeElapsed }}</v-card-subtitle>
            </v-card-item>
            <v-spacer></v-spacer>
            <v-btn variant="tonal" class="update" v-show="isAuthor()" @click="toggleEditComment">Edit</v-btn>
            <v-btn variant="text" class="delete" v-show="isAuthor()" @click="toggleDeleteComment">Delete</v-btn>
        </v-card-actions>
        <v-card-text>{{ com.comment_body }}</v-card-text>
    </v-card> -->

    <v-card
        class="mx-auto my-3 text-start"
    >
        <v-card-item class="align-start">
            <template v-slot:prepend>
                <v-avatar
                    class="mt-4"
                    color="blue-grey-lighten-2"
                ></v-avatar>
            </template>
            <v-card-item>
                <v-card-title class="text-subtitle-1 font-weight-medium">{{ com.User.name }}</v-card-title>
                <v-card-subtitle class="text-subtitle-2">{{ timeElapsed }}</v-card-subtitle>
                <template v-slot:append>
                    <v-menu bottom left>
                        <template v-slot:activator="{ props }">
                            <v-btn v-show="isAuthor()" v-bind="props" variant="text" color="blue-grey-darken-1" icon="mdi-dots-horizontal"></v-btn>
                        </template>
                        <v-list density="compact">
                            <v-list-item
                                @click="toggleEditComment" title="Edit" prepend-icon="mdi-pencil"
                            ></v-list-item>
                            <v-list-item
                                @click="toggleDeleteComment" title="Delete" prepend-icon="mdi-delete"
                            ></v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-card-item>
            <v-card-text>{{ com.comment_body }}</v-card-text>
        </v-card-item>
    </v-card>


    <div v-if="showEdit" class="open">
        <v-form @submit.prevent="handleEditComment">
            <v-textarea
                clearable
                auto-grow
                rows="1"
                label="Update comment"
                ref="updatedComment"
                :model-value="com.comment_body"
            ></v-textarea>
            <div class="d-flex justify-end">
                <v-btn variant="text" class="me-4" color="blue-grey-darken-1" @click="showEdit = false">Cancel</v-btn>
                <v-btn variant="tonal" color="blue-grey-darken-1" type="submit">Update</v-btn>
            </div>
        </v-form>
    </div>

    <!-- v-model="displayedComment"
    :model-value="com.comment_body" -->

    <div class="d-flex justify-end" v-if="showDelete">
        <v-btn variant="text" class="me-4" color="blue-grey-darken-1" @click="showDelete = false">Cancel</v-btn>
        <v-btn variant="tonal" color="blue-grey-darken-1" @click="handleDeleteComment">Yes, delete</v-btn>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'

export default {
    name: "recursive-comment",
    data() {
        return {
            showEdit: false,
            showDelete: false,
            displayedComment: '',
            submitMessage: ''
        }
    },
    props: ['com', 'activeUser', 'replies'],
    setup(props) {
        const isAuthor = () => {
            if (props.com.UserId == props.activeUser) {
                return true
            } else {
                return false
            }
        }

        const editable = computed(() => {
            return props.user.id === props.com.User.id
        })

        const timeElapsed = computed(() => {
            const currentTime = ref(new Date())
            const comTime = new Date(props.com.updatedAt)
            const ms = currentTime.value - comTime
            // const seconds = Math.floor((ms/1000)%60)
            const minutes = Math.floor((ms/1000/60)%60)
            const hours = Math.floor((ms/1000/60/60))
            // const hours = Math.floor((ms/1000/60/60)%24)
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

            // const formattedTime = [
            //     hours.toString().padStart(2, "0"),
            //     minutes.toString().padStart(2, "0"),
            //     seconds.toString().padStart(2, "0"),
            // ].join(":")
            
            // return `${formattedTime} ago ${days} ${weeks}`
        })
        
        return {timeElapsed, editable, isAuthor}
    },

    methods: {
        toggleEditComment() {
            this.showEdit = !this.showEdit
        },

        async handleEditComment() {
            axios.put('posts/comments/' + this.com.id, {
                // comment_body: this.displayedComment
                comment_body: this.$refs.updatedComment.modelValue
            }, {
                withCredentials: true
            })
                .then(res => {
                    this.submitMessage = res.data.message;
                    this.showEdit = false;
                    this.$emit('refreshData');
                })
                .catch(err => {
                    this.submitMessage = err.message;
                });
        },

        toggleDeleteComment() {
            this.showDelete = !this.showDelete
        },

        async handleDeleteComment() {
            axios.delete('posts/comments/' + this.com.id, {
                withCredentials: true
            })
                .then(res => {
                    this.submitMessage = res.data.message;
                    this.showDelete = false;
                    this.$emit('refreshData');
                })
                .catch(err => {
                    this.submitMessage = err.message;
                });
        }
    }
}
</script>

<style>
.comment {
    display: flex;
    flex-direction: column;
    border-bottom: .05rem solid lightgrey;
    margin: 2rem;
    padding: 1rem;
    background: whitesmoke;
    border-radius: 10px;
}
.comment__info {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>