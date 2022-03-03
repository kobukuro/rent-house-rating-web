import {location_api} from "@/api/index";

export function createRating(form, params) {
    return location_api.post('/ratings', form, {params: params})
}