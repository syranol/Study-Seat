
import { statePrototype } from "./state.prototype";
import { CAFE_CHECKBOX_TOGGLED, LIBRARY_CHECKBOX_TOGGLED, LOCATION_FORM_SUBMITTED } from "../../components/map-form/actions";
import { GEOLOCATION_CHANGED, LOCATION_NAME_UPDATED } from "components/map-frame/actions";

export default function rootReducer(previousState, action) {
    if (typeof previousState === "undefined") {
        return statePrototype;
    }
    switch (action.type) {
        case CAFE_CHECKBOX_TOGGLED: {
            return Object.assign({ }, previousState, {
                cafe: action.payload
            });
        }
        case LIBRARY_CHECKBOX_TOGGLED: {
            return Object.assign({ }, previousState, {
                library: action.payload
            });
        }
        case LOCATION_FORM_SUBMITTED:
        case LOCATION_NAME_UPDATED: {
            const loc = previousState.location;
            return Object.assign({ }, previousState, {
                location: Object.assign(loc, { 
                    locationName: action.payload
                })
            });
        }
        case GEOLOCATION_CHANGED: {
            const loc = previousState.location;
            return Object.assign({ }, previousState, {
                location: Object.assign(loc, {
                    geolocation: action.payload
                })
            });
        }
        default: {
            return previousState;
        }
    }
}