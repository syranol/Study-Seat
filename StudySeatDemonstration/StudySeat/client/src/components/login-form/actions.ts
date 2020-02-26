export const LOGIN_FORM_SUBMITTED = "LOGIN_FORM_SUBMITTED";
export function loginFormSubmitted(payload) {
    return {
        type: LOGIN_FORM_SUBMITTED,
        payload
    }
}