export const REGISTER_FORM_SUBMITTED = "REGISTER_FORM_SUBMITTED";
export function registerFormSubmitted(payload) {
    return {
        type: REGISTER_FORM_SUBMITTED,
        payload
    }
}