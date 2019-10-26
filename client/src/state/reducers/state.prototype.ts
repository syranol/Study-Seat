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
    },
    /** 
     * radius, in meters. cannot be more than 50000 
     */
    radius: 10000
};