import React, { Component, createRef, RefObject } from "react";

/**
 * renders the Google map frame
 */
class MapFrame extends Component {
    googleMap: google.maps.Map | undefined;
    googleMapHandle: RefObject<HTMLDivElement> = createRef();
    infoWindow: google.maps.InfoWindow | undefined;

    render() {
        return (
            <div id="google-map"
                ref={this.googleMapHandle}
                style={{width:"58vw", height:"64vh"}}>
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

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition( async (p) => {
                    var position = {
                        lat: p.coords.latitude,
                        lng: p.coords.longitude
                    };        

                    (this.infoWindow as google.maps.InfoWindow).setPosition(position);
                    (this.infoWindow as google.maps.InfoWindow).setContent('Your location!');
                    (this.infoWindow as google.maps.InfoWindow).open(this.googleMap);
                    (this.googleMap as google.maps.Map).setCenter(position);
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

    private handleLocationError (content, position) {
        (this.infoWindow as google.maps.InfoWindow).setPosition(position);
        (this.infoWindow as google.maps.InfoWindow).setContent(content);
        (this.infoWindow as google.maps.InfoWindow).open(this.googleMap);
    }
}

export default MapFrame