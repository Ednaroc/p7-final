import { ref } from '@vue/reactivity'

const likePost = (id) => {
    const like = ref(null)
    const error = ref(null)

    const load = async () => {
        axios.put('http://localhost:3333/api/posts/like/' + id, { 
            // params: {id}
        })
                .then(response => like.value = response.data.like)
                .catch(error => error.value = [{title: 'No posts found.'}])
                .finally(() => console.log('Data loading complete.')); 
    }

    return { like, error, load }
}

export default likePost