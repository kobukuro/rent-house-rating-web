import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate'
import userStoreModule from "@/store/module/user"
import locationStoreModule from "@/store/module/location"

Vue.use(Vuex);

const store = new Vuex.Store({
    //防止vuex的state在頁面刷新後就變回初始值
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],

    modules: {
        user: userStoreModule,
        location: locationStoreModule
    },

})

export default store