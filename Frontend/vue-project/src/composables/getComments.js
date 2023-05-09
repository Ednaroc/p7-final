import { ref } from '@vue/reactivity'

const getComments = (post_id) => {
    const comments = ref([])
    const comError = ref(null)

    const comLoad = async () => {
        axios.get('http://localhost:3333/api/comments/' + post_id)
                .then(response => comments.value = response.data)
                .catch(comError => comments.value = [{title: 'No comments found.'}])
                .finally(() => console.log('Data loading complete.'));
    }

    return { comments, comError, comLoad }
}

export default getComments