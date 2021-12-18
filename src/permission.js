import router from '@/router'
import {getAccessToken} from "@/utils/auth";

router.beforeEach((to, from, next) => {
    let token = getAccessToken()
    // console.log(to.name)
    // console.log(from.name)
    // console.log(next.name)
    if (to.name === 'Index') {

        if (!token) {
            next({name: 'Login'})
        }

    } else if (to.name === 'Login') {

        if (token) {
            next({name: 'Index'})
        }
    }
    next()
})