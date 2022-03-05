const state = {
    location_data: [
        // {id: 0, address: "夢時代購物中心", local: [22.595153, 120.306923], owner_name: '', ratings: []},
        // {id: -1, address: "漢神百貨", local: [22.61942, 120.296386], owner_name: '', ratings: []},
        // {id: -2, address: "漢神巨蛋", local: [22.669603, 120.302288], owner_name: '', ratings: []},
        // {id: -3, address: "大統百貨", local: [22.630748, 120.318033], owner_name: '', ratings: []}
    ]
}
const mutations = {
    CLEAR_LOCATIONS(state) {
        state.location_data = []
    },
    ADD_LOACTION: (state, new_location_data) => {
        state.location_data.push(new_location_data)
    },
    DELETE_LOCATION: (state, payload) => {
        let index = -1
        for (let i = 0; i < state.location_data.length; i++) {
            if (state.location_data[i].id === payload.location_id) {
                index = i;
            }
        }
        if (index !== -1) {
            state.location_data.splice(index, 1);
        }
    },
    ADD_RATING: (state, payload) => {
        state.location_data[payload.index]['ratings'].push(payload.rating_obj)
    },
    EDIT_RATING: (state, payload) => {
        state.location_data[payload.index]['ratings']['rating'] = payload.rating_obj.rating
        state.location_data[payload.index]['ratings']['comment'] = payload.rating_obj.comment
        state.location_data[payload.index]['ratings']['created_at'] = payload.rating_obj.created_at
    },
    UPDATE_LOCATION_RATINGS: (state, payload) => {
        state.location_data[payload.index]['ratings'] = payload.ratings
    }
}
const actions = {
    clear_locations({commit}) {
        commit('CLEAR_LOCATIONS')
    },
    add_location({commit}, new_location_data) {
        commit('ADD_LOACTION', new_location_data)
    },
    delete_location({commit}, payload) {
        commit('DELETE_LOCATION', payload)
    },
    add_rating({commit}, payload) {
        commit('ADD_RATING', payload)
    },
    edit_rating({commit}, payload) {
        commit('EDIT_RATING', payload)
    },
    update_location_ratings({commit}, payload) {
        commit('UPDATE_LOCATION_RATINGS', payload)
    }
}
const getters = {
    location_data(state) {
        return state.location_data
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