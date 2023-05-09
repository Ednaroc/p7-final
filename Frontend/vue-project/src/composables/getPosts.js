import { ref } from '@vue/reactivity'

const getPosts = () => {
    const posts = ref([])
    const error = ref(null)
    // const activeUser = ref(null)
    // const userInfo = ref([])

    const load = async () => {
        axios.get('http://localhost:3333/api/posts/', {
            withCredentials: true
        })
            .then(response => {
                posts.value = response.data.posts
                // activeUser.value = response.data.activeUser
                // handleActiveUser()
                // axios.get('http://localhost:3333/api/auth/user/' + activeUser.value, {
                //     withCredentials: true
                //   })
                //   .then(res => {
                //     userInfo.value = res.data.user
                //   })
                //   .catch(err => console.log(err));
            })
            .catch(error => error.value = 'No posts found.')
    }

    return { posts, error, load,
        // activeUser,
        // userInfo
    }
}

export default getPosts