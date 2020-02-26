export const LOGOUT_SUBMITTED = "LOGOUT_SUBMITTED";
export function logoutSubmitted(payload) {
    return {
        type: LOGOUT_SUBMITTED,
        payload
    }
}