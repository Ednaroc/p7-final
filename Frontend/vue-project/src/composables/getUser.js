import { ref } from '@vue/reactivity'

const getUser = (id) => {
    const userInfo = ref(null)
    const error = ref(null)

    const load = async () => {
        axios.get('http://localhost:3333/api/auth/user/' + id, {
            withCredentials: true
        })
            .then(response => {
                userInfo.value = response.data.user
                // console.log(userInfo)
                // console.log(userInfo.value)
                // activeUser.value = response.data.activeUser,
                // handleActiveUser()
            })
            .catch(error => error.value = 'No user found.')
    }

    // function handleActiveUser () {
        
    // }

    return { userInfo, error, load }
}

export default getUser