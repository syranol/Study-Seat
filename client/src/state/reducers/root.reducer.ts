
import { statePrototype } from "./state.prototype";
import {
    CAFE_CHECKBOX_TOGGLED, LIBRARY_CHECKBOX_TOGGLED, LOCATION_FORM_SUBMITTED, BOOK_STORE_CHECKBOX_TOGGLED
} from "components/map-form/actions";
import {
    GEOLOCATION_CHANGED, LOCATION_NAME_UPDATED
} from "components/map-frame/actions";
import {
    LOGIN_FORM_SUBMITTED
} from "components/login-form/actions";
import {
    LOGOUT_SUBMITTED
} from "../actions/logout.action";
import { REGISTER_FORM_SUBMITTED } from 'components/register-form/actions';
import {
    INITIALIZE
} from "../actions/initialize.action";

// TODO: refactor this into composite reducers when it gets too unwieldly (use combineReducers())

/**
 * rootReducer is the main reducer for the global redux store
 *  - all actions are passed through here to generate new states
 */
export default function rootReducer(previousState, action) {
    /**
     * initially, previousState will be undefined, return state prototype
     */
    if (typeof previousState === "undefined") {
        return statePrototype;
    }
    /**
     * handle actions dispatched after initialization
     */
    switch (action.type) {
        case CAFE_CHECKBOX_TOGGLED: {
            /** assign placeTypes.cafe to action payload */
            const prevPlacesSelected = previousState.placeTypes;
            return Object.assign({ }, previousState, {
                placeTypes: Object.assign(prevPlacesSelected, {
                    cafe: action.payload
                })
            });
        }
        case LIBRARY_CHECKBOX_TOGGLED: {
            /** assign placeTypes.library to action payload */
            const prevPlacesSelected = previousState.placeTypes;
            return Object.assign({ }, previousState, {
                placeTypes: Object.assign(prevPlacesSelected, {
                    library: action.payload
                })
            });
        }
        case BOOK_STORE_CHECKBOX_TOGGLED: {
            /** assign placeTypes.library to action payload */
            const prevPlacesSelected = previousState.placeTypes;
            return Object.assign({ }, previousState, {
                placeTypes: Object.assign(prevPlacesSelected, {
                    book_store: action.payload
                })
            });
        };
        case LOCATION_FORM_SUBMITTED:
        case LOCATION_NAME_UPDATED: {
            /** update location name */
            const prevLoc = previousState.location;
            return Object.assign({ }, previousState, {
                location: Object.assign(prevLoc, {
                    locationName: action.payload
                })
            });
        }
        case GEOLOCATION_CHANGED: {
            /** update geolocation */
            const prevLoc = previousState.location;
            return Object.assign({ }, previousState, {
                location: Object.assign(prevLoc, {
                    geolocation: action.payload
                })
            });
        }
        case LOGIN_FORM_SUBMITTED:
        case REGISTER_FORM_SUBMITTED: {
            const newState = Object.assign({ } , previousState);
            Object.keys(action.payload).forEach((x) => {
                Object.assign(newState.authentication, {
                    [x]: action.payload[x]
                });
            });
            Object.assign(newState.authentication, {
                isLoggedIn: true
            });
            return newState;
        }
        case LOGOUT_SUBMITTED: {
            if (action.payload) {
                const newState = Object.assign({ }, previousState);
                Object.assign(newState.authentication, {
                    isLoggedIn: false,
                    username: null,
                    token: null
                })
                return newState;
            } else {
                return previousState;
            }
        }
        case INITIALIZE: {
            /** handle the initialization action (dispatched at startup) */
            return Object.assign({ }, previousState, action.payload);
        }
        default: {
            return previousState;
        }
    }
}