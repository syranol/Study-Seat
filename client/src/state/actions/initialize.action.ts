export const INITIALIZE = "INITIALIZE";

export function initialize(payload) {
    return {
        type: INITIALIZE,
        payload
    }
}