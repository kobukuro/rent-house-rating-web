import {system_api} from "@/api";
import router from "@/router"

const state = {
    login: false,
    access_token: null,
    refresh_token: null,
    username: null,
    email: null,
    error: null
}
const mutations = {
    SET_ACCESS_TOKEN: (state, access_token) => {
        state.access_token = access_token
    },
    SET_REFRESH_TOKEN: (state, refresh_token) => {
        state.refresh_token = refresh_token
    },
    SET_USER: (state, username) => {
        state.username = username
    },
    SET_EMAIL: (state, email) => {
        state.email = email
    },
    SET_LOGIN: (state, login) => {
        state.login = login
    },
    SER_ERROR(state, payload) {
        state.error = payload
    },
    CLEAR_ERROR(state) {
        state.error = null
    }

}
const actions = {

    login({commit}, user_info) {
        const {email, password} = user_info
        system_api.post('/login', {email: email, password: password})
            .then(res => {
                switch (res.status) {
                    case 200:
                        commit('SET_LOGIN', true)
                        commit('SET_ACCESS_TOKEN', res.data.access)
                        commit('SET_REFRESH_TOKEN', res.data.refresh)
                        commit('SET_USER', res.data.username)
                        commit('SET_EMAIL', email)
                        router.push("/");
                }

            })
            .catch(error => {
                    switch (error.response.status) {
                        case 401:
                            commit('SER_ERROR', 'Given credential is incorrect.')
                    }
                }
            )
    },
    logout({commit}) {
        commit('SET_LOGIN', false)
        commit('SET_ACCESS_TOKEN', null)
        commit('SET_REFRESH_TOKEN', null)
        commit('SET_USER', null)
        commit('CLEAR_ERROR')
        router.push({name: 'Login'})
    },
    set_access_token({commit}, access_token) {
        commit('SET_ACCESS_TOKEN', access_token)
    },
    clearError({commit}) {
        commit('CLEAR_ERROR')
    }
}
const getters = {
    error(state) {
        return state.error
    }

}

export default {
    // If you want your modules to be more self-contained or reusable,
    // you can mark it as namespaced with namespaced: true. When the module is registered,
    // all of its getters, actions and mutations
    // will be automatically namespaced based on the path the module is registered at.
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}