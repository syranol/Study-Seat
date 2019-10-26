import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { 
    cafeCheckboxToggled, locationFormSubmitted, libraryCheckboxToggled 
} from "./actions";

interface IMapFormProps {
    dispatch: (action) => void,
    geolocation: {
        lat: number,
        lng: number
    },
    locationName: string,
    cafe: boolean, 
    library: boolean, 
    radius: number
}

class MapForm extends Component<IMapFormProps, { }> {
    private placeTypeOptions = ["cafe", "library"];

    state = { 
        searchStr: "",
        cafe: false,
        library: false
    }
    
    constructor(props) {
        super(props);
    }

    placeTypeSelected = (evt: { target: { id: string, checked: boolean } }): void => {
        // TODO: store in local storage to persist across refresh
        switch (evt.target.id) {
            case "cafe": {
                this.props.dispatch(cafeCheckboxToggled(evt.target.checked)); 
                break;
            }    
            case "library": {
                this.props.dispatch(libraryCheckboxToggled(evt.target.checked)); 
                break;
            }
        }
    }

    private locationInputChanged = (evt: { target: { value: string } }): void => {
        this.setState({
            searchStr: evt.target.value
        });
    }

    private submitForm = (): void => {
        this.props.dispatch(locationFormSubmitted(this.state.searchStr));
    }

    componentDidMount(): void {
        this.setState({
            searchStr: this.props.locationName
        });
    }

    componentDidUpdate(prevPropSnapshot): void {
        if (this.props.locationName !== prevPropSnapshot.locationName) {
            // TODO: fix issue where this no longer updates on page load
            this.setState({
                searchStr: this.props.locationName
            });
        }
    }

    // TODO: factor out styles
    render() {
        // TODO: add dropdown to select radius
        return(            
        <div className="container" style={{width:"48%"}}>
            <div className="flex-row" style={{
                    alignItems: "center", 
                    justifyContent: "center",
                }}>
                <div className="flex-column" style={{width:"30%"}}>
                    <h5>I'm in</h5>
                </div>
                <div className="flex-column" style={{
                    alignItems: "center", width:"50%"}}>
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
            </div>
            <div className="flex-row" style={{
                    alignItems: "center", 
                    justifyContent: "center",
                }}>   
                <h5>looking for a </h5>
                {this.placeTypeOptions.map((placeType: string) => (
                    <div key={`opt-${placeType}`} className="mb-3">
                        <Form.Check 
                            type="checkbox"
                            id={`${placeType}`}
                            label={`${placeType}`}
                            checked={this.props[placeType]}
                            onChange={this.placeTypeSelected}/>
                        </div>
                ))}
                
            </div>
            <div className="flex-row" style={{
                    alignItems: "center", 
                    justifyContent: "center",
                }}>
                    <div className="flex-column">
                        <h5>within</h5>
                    </div>
                    {this.props.radius}
                    {/* <div className="flex-column">
                        <Dropdown></Dropdown>
                    </div> */}
                </div>
            <div className="flex-row" style={{
                    alignItems: "center", 
                    justifyContent: "space-around",
                }}>
            </div>
    </div>)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        geolocation: state.location.geolocation,
        locationName: state.location.locationName,
        cafe: state.placeTypes.cafe,
        library: state.placeTypes.library,
        radius: state.radiusss
    };
}

export default connect(mapStateToProps, null)(MapForm);