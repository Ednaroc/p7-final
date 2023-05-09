import { ref } from '@vue/reactivity'
import axios from 'axios'

const checkSession = () => {
    const message = ref(null)
    const error = ref(null)
    const userActive = ref(null)

    const load = async () => {
        axios.get('http://localhost:3333/api/auth/', {
            withCredentials: true
        })
        .then(res => {
            console.log(res.data.message)
            userActive.value = res.data.userActive
        })
        .catch(err => error.value = err)
        .finally(() => console.log('Session verification complete:', userActive));
    }

    return { message, error, userActive, load }
}

export default checkSession