<template>
    <v-card class="mx-auto px-6 py-6 my-6" max-width="800">
        <v-card-title>
            <span class="text-h5">Create a new post</span>
        </v-card-title>
        <v-card-item>
            <v-form @submit.prevent="handleSubmitMedia" ref="form" v-model="form">
                <v-text-field
                    v-model="title"
                    clearable
                    :rules="[required]"
                    label="Title"
                ></v-text-field>
                <v-textarea
                    v-model="body"
                    clearable
                    auto-grow
                    :rules="[required]"
                    label="Content"
                ></v-textarea>
                <v-divider></v-divider>
                <p class="py-2">Post multimedia</p>
                <v-file-input
                    @change="handleFileUpload( $event )"
                    prepend-icon=""
                    prepend-inner-icon="mdi-paperclip"
                    label="File input"
                ></v-file-input>
                <v-text-field
                    v-model="alt_text"
                    clearable
                    label="Alt text"
                ></v-text-field>
                <div class="d-flex justify-end">
                    <v-btn variant="text" class="me-4" @click="$refs.form.reset()">Clear</v-btn>
                    <v-btn type="submit" :disabled="!form">Save</v-btn>
                </div>
            </v-form>
        </v-card-item>
        <h3>{{ submitMessage }}</h3>
        <!-- <v-card-actions class="justify-end">
            <v-btn @click="router.push(router.go())" v-show="!showButton">Close</v-btn>
        </v-card-actions> -->
    </v-card>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            form: false,
            // form: {
            //     title: '',
            //     body: ''
            // },
            title: '',
            body: '',
            tempTag: '',
            tags: [],
            submitMessage: '',
            file:'',
            alt_text:''
            
        }
    },
    methods: {
        required (v) {
            return !!v || 'Field is required'
        },
        
        addTag(e) {
            const test = this.tempTag.slice(0, -1);
            if (e.key === ',' && test) {
                if (!this.tags.includes(test)) {
                    this.tags.push(test)
                }
                this.tempTag = ''
            }
        },
        deleteTag(tag) {
            // equal to a new value, cycles through an array and fires up a function for each item and keeps it if true
            this.tags = this.tags.filter((item) => {
                // if not equal to tag return true and keep the item in the array, otherwise removes it
                return tag !== item
            })
        },

        handleFileUpload(event){
            this.file = event.target.files[0];
        },

        async handleSubmitMedia() {
            const formData = new FormData()
            formData.append('title', this.title)
            formData.append('post_body', this.body)
            formData.append('file', this.file)
            formData.append('alt_text', this.alt_text)
            axios.post(
                'posts/',
                formData,
                {
                    headers: {
                        // 'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                })
                .then(res => {
                    this.submitMessage = res.data.message;
                    this.file = '';
                    this.$router.push('/posts/'+ res.data.post.id);
                })
                .catch(err => {
                    this.submitMessage = err.message;
                });
        },

        async handleSubmit() {
            const token = 'eyJhbGciOiJ3NzM2MjMwfQ.MJAZPRbFlu56FDL8sUFHSwJtOias4';
            axios.post(
                'http://localhost:3333/api/posts/',
                {
                    user_id: 13,
                    title: this.title,
                    post_body: this.body
                },
                {
                    // params: {
                    //     user_id: 13
                    // },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(res => {
                    this.submitMessage = res.data.message;
                    this.$router.push('/posts/'+ res.data.post.id);
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