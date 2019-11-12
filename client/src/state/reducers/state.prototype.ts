/**
 * Prototype used to configure the 'shape' of the global Redux datastore
 *  - initially, state will be set to this object
 *  - state is cached in browser localStorage after first use, so on subsequent
 *      reloads, state will persist
 *  - properties will be mutated by user interaction
 */
export const statePrototype = {
    location: {
        locationName: "",
        geolocation: {
            lat: null,
            lng: null
        }
    },
    placeTypes: {
        cafe: false,
        library: false,
        book_store: false
    },
    /** 
     * radius, in meters. cannot be more than 50000 
     */
    radius: 10000,
    /**
     * login / authentication
     */
    authentication: {
        
    }
};