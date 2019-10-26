export const CAFE_CHECKBOX_TOGGLED = "CAFE_CHECKBOX_TOGGLED";
export function cafeCheckboxToggled(payload) {
    return {
        type: CAFE_CHECKBOX_TOGGLED,
        payload
    }
}

export const LIBRARY_CHECKBOX_TOGGLED = "LIBRARY_CHECKBOX_TOGGLED";
export function libraryCheckboxToggled(payload) {
    return {
        type: LIBRARY_CHECKBOX_TOGGLED,
        payload
    }
}

export const LOCATION_FORM_SUBMITTED = "LOCATION_FORM_SUBMITTED";
export function locationFormSubmitted(payload) {
    return {
        type: LOCATION_FORM_SUBMITTED,
        payload
    }
}