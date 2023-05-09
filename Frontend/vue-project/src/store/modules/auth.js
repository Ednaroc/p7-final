import axios from 'axios';

// Define data and default values
const state = {
    user: null
};

// Functionalities to get the state
const getters = {
    user: (state) => {
        return state.user;
    },

    isAuthenticated: state => !!state.user,
    StateUser: state => state.user
};

// Functions to commit a mutation to change the state
// or can be used to dispatch i.e calls another action
const actions = {
    userHandling(context, user) {
        context.commit('setUser2', user);
    },

    async LogIn({commit}, User) {
        await axios.post('auth/login', User)
        await commit('setUser', User.get('email'))
    },
    async LogOut({commit}) {
        await axios.post('auth/logout')
        let user = null
        await commit('logOut', user)
    }
};

const mutations = {
    setUser2(state, userId) {
        state.user = userId;
    },

    setUser(state, email) {
        state.user = email
    },
    logOut(state) {
        state.user = null
    }
};

export default {
  state,
  getters,
  actions,
  mutations
};