import React, { 
    Component, createRef, RefObject 
} from "react";
import { Redirect } from "react-router-dom";
import MapForm from "../map-form/map-form"
import { connect } from "react-redux";
import { geolocationChanged, locationNameUpdated } from "./actions";

// TODO: persist zoom level

/**
 * defines the props on the MapFrameComponent (mapped to global Redux state below
 *  in mapStateToProps())
 * @param locationName the human readable name of the current location being seached
 * @param radius the current search radius
 * @param placeTypesSelected the currently selected place types
 * @param dispatch reference to the Redux dispatch function
 */
interface IMapFrameProps {
    locationName: string,
    radius: number,
    placeTypesSelected: string[],
    dispatch: (action) => void
}

/**
 * interface defining the base component state for MapFrameComponent
 */
interface IMapFrameState {
    /** TBD */
}

/**
 * defines the interface for a reverse geocoding result returned from Google maps
 *  geocoding API
 */
interface IReverseGeocodeResult {
    geometry: {
        location: {
            lat: () => number,
            lng: () => number
        }
    }
}

/**
 * renders the Google map frame
 */
class MapFrame extends Component<IMapFrameProps, IMapFrameState> {
    /**
     * Map object and HTML element reference
     */
    private googleMap: google.maps.Map | undefined;
    private googleMapHandle: RefObject<HTMLDivElement> = createRef();

    /**
     * Info window used to display messages
     */
    private infoWindow: google.maps.InfoWindow | undefined;

    /**
     * Service instances
     */
    private placesService: google.maps.places.PlacesService | undefined;
    private geocodingService: google.maps.Geocoder | undefined;

    /**
     * array containing all markers currently on the map
     */
    private markers: google.maps.Marker[] | undefined = [];

    constructor(props) {
        super(props);
    }

    // TODO: ideally this debounce could be made obsolete...
    //          - necessary for now, or else too many redundant requests made
    private debounceComponentDidUpdate: boolean = false;

    /**
     * React lifecycle hook triggered by update to the components props (due to an update
     *  to the global Redux store)
     * @param prevPropSnapshot a snapshot of the components props before updateSs
     */
    componentDidUpdate(prevPropSnapshot): void {
        /**
         * look for relevant changes
         */
        let locationChanged = false, placesSelectedChanged = false;
        if (this.props.locationName !== prevPropSnapshot.locationName) {
            locationChanged = true;
        }
        if (this.props.placeTypesSelected !== prevPropSnapshot.placeTypesSelected) {
            placesSelectedChanged = true;
        }
        /**
         * if relevant changes occurred, placesService is defined, and method not currently debounced,
         *  get new geolocation from new location name
         */
        if (locationChanged || placesSelectedChanged) {
            if (this.placesService && !this.debounceComponentDidUpdate) {

                /**
                 * Debounce componentDidUpdate (causes the if statement not to execute again until
                 *  timeout expires)
                 */
                this.debounceComponentDidUpdate = true;
                setTimeout(() => this.debounceComponentDidUpdate = false, 100);

                /**
                 * query the Google placesService to get latitude and longitude
                 */
                this.placesService.findPlaceFromQuery({
                    query: this.props.locationName,
                    fields: ["geometry.location"],
                }, (res) => {
                    /**
                     * if google map object defined and res defined
                     *  - pan to new geolocation
                     *  - update geolocation in global Redux store
                     *  - populate map with new markers
                     */
                    if (this.googleMap && res) {
                        const newGeolocation = {
                            lat: (res as IReverseGeocodeResult[])[0].geometry.location.lat(),
                            lng: (res as IReverseGeocodeResult[])[0].geometry.location.lng()
                        }
                        this.googleMap.panTo(newGeolocation);
                        this.props.dispatch(geolocationChanged(newGeolocation))
                        this.populateMap(newGeolocation);
                    }
                });
            }
        }
    }

    /**
     * React lifecycle hook triggered when the component is mounted on the DOM
     */
    async componentDidMount() {
        /**
         * load google maps script, using API key fetched from server, append script to window
         */
        const googleMapsScript = document.createElement("script");
        const reply = await fetch("/api-key").then(res => res.json());
        const key = reply["api_key"];
        googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
        window.document.body.appendChild(googleMapsScript);

        /**
         * when the google maps script loads, create the google map object and info window, instantiate
         *  Google services, get current geolocation from browser
         */
        googleMapsScript.addEventListener("load", async () => {
            this.googleMap = this.createGoogleMap();
            this.infoWindow = new (window as any).google.maps.InfoWindow()
            this.placesService = new google.maps.places.PlacesService(this.googleMap as google.maps.Map);
            this.geocodingService = new google.maps.Geocoder() as google.maps.Geocoder;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition( async (p) => {
                    /**
                     * update geolocation in global Redux store
                     */
                    var position = {
                        lat: p.coords.latitude,
                        lng: p.coords.longitude
                    };
                    this.props.dispatch(geolocationChanged(position));

                    /**
                     * update location name based on geolocation value retrieved by browser
                     */
                    if (this.geocodingService) {
                        this.geocodingService.geocode({
                            location: position,
                        }, (res) => {
                            this.props.dispatch(locationNameUpdated(res[0].address_components[3].short_name));
                        });
                    }

                    /**
                     * configure the info window and center the map
                     */
                    (this.infoWindow as google.maps.InfoWindow).setPosition(position);
                    (this.infoWindow as google.maps.InfoWindow).setContent('Your location!');
                    (this.infoWindow as google.maps.InfoWindow).open(this.googleMap);
                    (this.googleMap as google.maps.Map).setCenter(position);

                    /**
                     * populate map with markers
                     */
                    await this.populateMap(position);
                }, async (e) => {
                    console.error(e);
                    this.handleLocationError('Geolocation service failed', (this.googleMap as google.maps.Map).getCenter());
                }, {
                    enableHighAccuracy: true,
                    maximumAge: 100000,
                    timeout: 100000
                });
            } else {
                this.handleLocationError('No geolocation available.', (this.googleMap as google.maps.Map).getCenter());
            }
        });
    }

    /**
     * Initializes the google map object
     */
    createGoogleMap = () => {
        return new (window as any).google.maps.Map(this.googleMapHandle.current, {
            zoom: 10,
            center: {
                lat: 30,
                lng: 30
            },
            disableDefaultUI: true  // TODO: what does this do?

        });
    }

    /**
     * populates the map with markers according to currently selected place types
     */
    private populateMap = (position) => {
        // TODO: why is this being called twice at page load

        this.clearMarkers();

        this.props.placeTypesSelected.map((type) => {
            if (this.placesService) {
                /** formulate a request per placetype */
                const request = {
                    location: position,
                    radius: this.props.radius,
                    types: [type]
                };

                /** perform a search for nearby places of interest */
                this.placesService.nearbySearch(request, (res, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        for (let i = 0; i < res.length; i++) {
                            const place = res[i] as google.maps.places.PlaceResult;
                            if (place.geometry !== undefined
                                && place.types !== undefined
                                /**
                                 * it seems the Google Places API returns hotel information when no place
                                 *  types are supplies... This is a hack to circumvent this
                                 */
                                && place.types.filter((x) => {
                                    return this.props.placeTypesSelected.indexOf(x) !== -1
                                }).length > 0) {

                                /**
                                 * Place a new marker on map, and store a reference to it in this.markers
                                 */

                                 const newMarker = new google.maps.Marker({
                                    map: this.googleMap,
                                    title: place.name,
                                    position: place.geometry.location
                                 });

                                 //Initiates the content of the info window
                                 const infoWindow = new google.maps.InfoWindow({
                                    maxWidth: 200, 
                                   content: place.name +'<br/>'+ 
                                   "RATING: " + place.rating +'<br/>'+ 
                                   "OPEN: " + (place.opening_hours as any).open_now +'<br/>'+ 
                                   "PRICE LEVEL(out of 5): " + place.price_level +'<br/>'+
                                   "ADDRESS: " + place.vicinity
                                 });

                                //Listener so only clicked marker will show info
                                newMarker.addListener("click", () => {
                                  infoWindow.open(this.googleMap, newMarker);
                                });

                                //google.maps.event.addListener(newMarker, 'click', )
                                //google.maps.event.addListener(newMarker, 'click', function() {

                                //infoWindow.open(newMarker.map, newMarker);
                                //});



                            }
                        }
                    }
                });
            }
        });
    }

    /**
     * erase all markers from the map
     */
    private clearMarkers(): void {
        if (this.markers) {
            for (const marker of this.markers) {
                marker.setMap(null);
            }
        }
    }

    /**
     * handle case where browser does not retrieve geolocation
     *  // TODO: figure out why this always fails on mobile...
     */
    private handleLocationError (content, position) {
        (this.infoWindow as google.maps.InfoWindow).setPosition(position);
        (this.infoWindow as google.maps.InfoWindow).setContent(content);
        (this.infoWindow as google.maps.InfoWindow).open(this.googleMap);
    }

    /**
     * Render the JSX template on the DOM
     */
    render() {
        // if (true) {
        //     return <Redirect to="/login"></Redirect>
        // }
        return (
            <div style={{height: "100%"}}>
                <div style={{height: "15%"}}>
                    <MapForm></MapForm>
                </div>

                <div id="google-map" style={{height: "100%"}}
                    ref={this.googleMapHandle}>
                </div>
            </div>)
    }
}

/**
 * Map Redux state values to component props
 */
const mapStateToProps = (state, ownProps) => {
    return {
        locationName: state.location.locationName,
        radius: state.radius,
        placeTypesSelected: Object.keys(state.placeTypes)
            .filter(key => state.placeTypes[key])
            .map((key) => {
                if (state.placeTypes[key])
                    return key;
            })
    }
}

/**
 * connect the MapFrame component to the global Redux store
 */
export default connect(mapStateToProps, null)(MapFrame)
