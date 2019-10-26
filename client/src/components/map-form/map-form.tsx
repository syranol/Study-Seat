import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { CAFE_CHECKBOX_TOGGLED, LIBRARY_CHECKBOX_TOGGLED, cafeCheckboxToggled, locationFormSubmitted } from "./actions";

interface IMapFormProps {
    dispatch: (action) => void,
    geolocation: {
        lat: number,
        lng: number
    },
    locationName: string,
    cafe: boolean, 
    library: boolean, 
}

class MapForm extends Component<IMapFormProps, { }> {
    private placeTypeOptions = ["cafe", "library"];

    state = { 
        searchStr: ""
    }
    
    constructor(props) {
        super(props);
    }

    placeTypeSelected = (evt: { target: { id: string, checked: boolean } }): void => {
        let actionType;
        switch (evt.target.id) {
            case "cafe": actionType = CAFE_CHECKBOX_TOGGLED; break;
            case "library": actionType = LIBRARY_CHECKBOX_TOGGLED; break;
        }
        this.props.dispatch(cafeCheckboxToggled(evt.target.checked));
    }

    private locationInputChanged = (evt: { target: { value: string } }): void => {
        this.setState({
            searchStr: evt.target.value
        });
    }

    private submitForm = (): void => {
        this.props.dispatch(locationFormSubmitted(this.state.searchStr));
    }

    componentDidUpdate(prevPropSnapshot): void {
        if (this.props.locationName !== prevPropSnapshot.locationName) {
            this.setState({
                searchStr: this.props.locationName
            });
        }
    }

    render() {
        return(               
            <div className="flex-row container" style={{
                    width: "60%",
                    alignItems: "center", 
                    justifyContent: "space-around",
                }}>   
                <div className="flex-column">
                    <h5>I'm looking for a... </h5>
                </div>
                <div className="flex-column" style={{
                    alignItems: "flex-start"
                }}>
                    {this.placeTypeOptions.map((placeType: string) => (
                        <div key={`opt-${placeType}`} className="mb-3">
                        <Form.Check 
                            type="checkbox"
                            id={`${placeType}`}
                            label={`${placeType}`}
                            onChange={this.placeTypeSelected}/>
                        </div>
                    ))}
                </div>
                <div className="flex-column" style={{
                    alignItems: "flex-start",
                    justifyContent: "flex-end"
                }}>
                    <h5>in</h5>
                </div>
                <div className="flex-column" style={{
                    width: "28%"
                }}>
                    <input className="form-control" type="text" value={this.state.searchStr}
                        onChange={this.locationInputChanged}></input>
                </div>
                <div className="flex-column" style={{
                    width: "20%"
                }}>
                    <Button variant="primary" onClick={this.submitForm}>
                        Submit
                    </Button>
                </div>
            </div>)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        geolocation: state.location.geolocation,
        locationName: state.location.locationName,
        cafe: state.cafe,
        library: state.library
    };
}

export default connect(mapStateToProps, null)(MapForm);