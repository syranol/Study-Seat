import React, { Component, createRef, RefObject } from "react";
import MapForm from "../map-form/map-form"
import { connect } from "react-redux";
import { geolocationChanged, locationNameUpdated } from "./actions";

interface IMapFrameProps {
    locationName: string,
    dispatch: (action) => void
}

interface IMapFrameState {

}

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
    private googleMap: google.maps.Map | undefined;
    private googleMapHandle: RefObject<HTMLDivElement> = createRef();
    private infoWindow: google.maps.InfoWindow | undefined;
    private placesService: google.maps.places.PlacesService | undefined;
    private geocodingService: google.maps.Geocoder | undefined; 

    constructor(props) {
        super(props);
    }


    handleLocationNameChanged = (location) => {
        if (this.placesService) {
            this.placesService.findPlaceFromQuery({
                query: location,
                fields: ["geometry.location"],
            }, (res) => {
                if (this.googleMap) {
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

    componentDidUpdate(prevPropSnapshot): void {
        if (this.props.locationName !== prevPropSnapshot.locationName) {
            this.handleLocationNameChanged(this.props.locationName);
        }
    }

    render() {
        return (
            <div style={{height: "100%"}}>
                <MapForm></MapForm>
                <div id="google-map" style={{height: "100%"}}
                    ref={this.googleMapHandle}>
                </div>
            </div>)
    }

    async componentDidMount() {
        const googleMapsScript = document.createElement("script");
        const reply = await fetch("/api-key").then(res => res.json());
        const key = reply["api_key"];

        googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
        window.document.body.appendChild(googleMapsScript);

        googleMapsScript.addEventListener("load", async () => {
            this.googleMap = this.createGoogleMap();
            this.infoWindow = new (window as any).google.maps.InfoWindow()
            this.placesService = new google.maps.places.PlacesService(this.googleMap as google.maps.Map);
            this.geocodingService = new google.maps.Geocoder() as google.maps.Geocoder;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition( async (p) => {
                    var position = {
                        lat: p.coords.latitude,
                        lng: p.coords.longitude
                    };        
                    this.props.dispatch(geolocationChanged(position));
                    if (this.geocodingService) {
                        this.geocodingService.geocode({
                            location: position,
                        }, (res) => {
                            this.props.dispatch(locationNameUpdated(res[0].address_components[3].short_name));
                        });
                    }

                    (this.infoWindow as google.maps.InfoWindow).setPosition(position);
                    (this.infoWindow as google.maps.InfoWindow).setContent('Your location!');
                    (this.infoWindow as google.maps.InfoWindow).open(this.googleMap);
                    (this.googleMap as google.maps.Map).setCenter(position);

                    await this.populateMap(position);
                }, async () => {
                    this.handleLocationError('Geolocation service failed', (this.googleMap as google.maps.Map).getCenter());
                });
            } else {
                this.handleLocationError('No geolocation available.', (this.googleMap as google.maps.Map).getCenter());
            }
        });
    }

    createGoogleMap = () => {
        return new (window as any).google.maps.Map(this.googleMapHandle.current, {
            zoom: 10,
            center: {
                lat: 30,
                lng: 30
            },
            disableDefaultUI: true
        });
    }

    private populateMap = (position) => {
        console.log("POPULATE MAP");
        const request = {
            location: position,
            radius: 5000,
            types: ['cafe']
        };
        (this.placesService as google.maps.places.PlacesService).nearbySearch(request, (res, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < res.length; i++) {
                    const place = res[i] as google.maps.places.PlaceResult;
                    if (place.geometry !== undefined) {
                        const marker = new google.maps.Marker({
                            map: this.googleMap,
                            title: place.name,
                            position: place.geometry.location
                        });
                    }
                }
            }
        });
    }

    private handleLocationError (content, position) {
        (this.infoWindow as google.maps.InfoWindow).setPosition(position);
        (this.infoWindow as google.maps.InfoWindow).setContent(content);
        (this.infoWindow as google.maps.InfoWindow).open(this.googleMap);
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        locationName: state.location.locationName
    }
}

export default connect(mapStateToProps, null)(MapFrame)