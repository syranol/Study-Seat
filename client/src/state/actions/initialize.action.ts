/**
 * action dispatched at page load, triggers the initialization of the Redux datastore
 */
export const INITIALIZE = "INITIALIZE";
export function initialize(payload) {
    return {
        type: INITIALIZE,
        payload
    }
}