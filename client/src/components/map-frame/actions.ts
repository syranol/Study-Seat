/**
 * action dispatched whenever geolocation changed
 */
export const GEOLOCATION_CHANGED = "GEOLOCATION_CHANGED";
export function geolocationChanged(payload) {
    return {
        type: GEOLOCATION_CHANGED,
        payload
    }
}

/**
 * action dispatched whenever location name changed
 */
export const LOCATION_NAME_UPDATED = "LOCATION_NAME_UPDATED";
export function locationNameUpdated(payload) {
    return {
        type: LOCATION_NAME_UPDATED,
        payload
    }
}