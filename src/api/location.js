import {location_api} from "@/api/index";

export function listRatings(pk, params) {
    return location_api.get('/ratings', {params: params})
}

export function createRating(form, params) {
    return location_api.post('/ratings', form, {params: params})
}

export function partialUpdateRating(pk, form, params) {
    return location_api.patch(`/ratings/${pk}`, form, {params: params})
}

export function deleteRating(pk) {
    return location_api.delete(`/ratings/${pk}`)
}

