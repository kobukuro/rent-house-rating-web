import store from '@/store'

export let jwt_prefix = 'Bearer'

export let getAccessToken = function () {
    return store.state.user.access_token
}

export let getRefreshToken = function () {
    return store.state.user.refresh_token
}

export let getUserName = function () {
    return store.state.user.username
}

export let getEmail = function () {
    return store.state.user.email
}

