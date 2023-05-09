import { ref } from '@vue/reactivity'

const getPost = (id) => {
    const post = ref(null)
    const error = ref(null)
    // const activeUser = ref(null)

    const load = async () => {
        axios.get('http://localhost:3333/api/posts/' + id, {
            withCredentials: true
        })
            .then(response => {
                post.value = response.data.post
                // activeUser.value = response.data.activeUser
            })
            // .catch(error => post.value = [{title: 'No posts found.'}])
            .catch(error => error.value = 'No post found.')
            // .finally(() => console.log('Data loading complete.')); 
    }

    return { post, error, load,
        // activeUser
    }
}

export default getPost