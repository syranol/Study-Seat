import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { 
    cafeCheckboxToggled, locationFormSubmitted, libraryCheckboxToggled, bookStoreCheckboxToggled 
} from "./actions";

/**
 * IMapFormProps defines the props of the MapFormComponent
 *  - see mapStateToProps() for info on how these props map to Redux state
 * @param dispatch is a handle which references the Redux dispatch function, allows dispatching of
 *                  actions to the global Redux data store
 * @param geolocation specifies the latitude and longitude currently being searched
 * @param locationName human-readable name of the location currently being searched
 * @param book_store indicates whether or not bookstore checkbox toggled
 * @param cafe indicates whether or not cafe checkbox toggled
 * @param library indicates whether or not library checkbox toggled
 * @param radius the search radius
 */
interface IMapFormProps {
    dispatch: (action) => void,
    geolocation: {
        lat: number,
        lng: number
    },
    locationName: string,
    book_store: boolean,
    cafe: boolean, 
    library: boolean, 
    radius: number
}

/**
 * MapForm presents a form allowing user to input a new location, as well as toggle
 *  different place types on and off
 */
class MapForm extends Component<IMapFormProps, { }> {
    /**
     * Available placeTypes
     *  TODO: it would be nice to produce these in a more data-driven manner, such that
     *          they didn't need to be redundantly defined here (they are essentially a 
     *          subset of Object.keys(statePrototype.placeTypes))
     */
    private placeTypeOptions = ["cafe", "library", "book_store"];

    /**
     * base component state initialization
     */
    state = { 
        searchStr: "",
        cafe: false,
        library: false
    }
    
    constructor(props) {
        /** call Component constructor, passing in props */
        super(props);
    }

    /**
     * Called when a place type is selected or unselected (checkbox toggled)
     * @param evt the DOM event emitted by the click event
     */
    placeTypeSelected = (evt: { target: { id: string, checked: boolean } }): void => {
        /**
         * dispatches a particular action to the Redux store depending on the type of checkbox toggled
         */
        switch (evt.target.id) {
            case "cafe": {
                this.props.dispatch(cafeCheckboxToggled(evt.target.checked)); 
                break;
            }    
            case "library": {
                this.props.dispatch(libraryCheckboxToggled(evt.target.checked)); 
                break;
            }
            case "book_store": {
                this.props.dispatch(bookStoreCheckboxToggled(evt.target.checked));
                break;
            }
        }
    }

    /**
     * called whenever the text value in the location input field changes
     *  - commits current value to component state (NOT global Redux store, user must
     *      submit form to commit value)
     */
    private locationInputChanged = (evt: { target: { value: string } }): void => {
        this.setState({
            searchStr: evt.target.value
        });
    }

    /**
     * called when user clicks submit button
     *  - dispatches a locationFormSubmitted() action, which commits the components local
     *      state.searchStr to the global Redux store
     */
    private submitForm = (): void => {
        this.props.dispatch(locationFormSubmitted(this.state.searchStr));
    }

    /**
     * React lifecycle hook implementation which is triggered when the component mounts
     *  on the DOM
     *  - populates component state
     *      - puts current location name in search input field
     */
    componentDidMount(): void {
        this.setState({
            searchStr: this.props.locationName
        });
    }

    /**
     * React lifecycle hook implementation which is triggered when the global Redux store
     *  is updated, triggering an update to the components props, which are mapped to the
     *  global Redux store
     *  - sets local state according to new props
     * @param prevPropSnapshot a snapshot of the components props before update
     */
    componentDidUpdate(prevPropSnapshot): void {
        if (this.props.locationName !== prevPropSnapshot.locationName) {
            this.setState({
                searchStr: this.props.locationName
            });
        }
    }

    render() {
        return(            
        <div className="container" style={{width:"38%"}}>
            <div className="flex-row" style={{
                    alignItems: "center", 
                    justifyContent: "space-around",
                }}>
                <div>
                    <h5>I'm in</h5>
                </div>
                <div>
                    <input className="form-control" type="text" value={this.state.searchStr}
                        onChange={this.locationInputChanged}></input>
                </div>
                <div>
                    <Button variant="primary" onClick={this.submitForm}>
                        Submit
                    </Button>
                </div>
            </div>
            <div className="flex-row" style={{
                    alignItems: "center", 
                    justifyContent: "space-around",
                    height: "100px"
                }}>   
                <h5>looking for a </h5>
                {this.placeTypeOptions.map((placeType: string) => (
                    <div key={`opt-${placeType}`} className="mb-3">
                        <Form.Check 
                            type="checkbox"
                            id={`${placeType}`}
                            label={`${placeType}`.replace("_", " ")}
                            checked={this.props[placeType]}
                            onChange={this.placeTypeSelected}/>
                        </div>
                ))}
                
            </div>
    </div>)
    }
}

/**
 * Maps state updates to component's props
 * @param state state update from the global Redux store
 * @param ownProps components own props
 */
const mapStateToProps = (state, ownProps) => {
    return {
        geolocation: state.location.geolocation,
        locationName: state.location.locationName,
        cafe: state.placeTypes.cafe,
        library: state.placeTypes.library,
        book_store: state.placeTypes.book_store,
        radius: state.radius
    };
}

/**
 * Connect component to global Redux store
 */
export default connect(mapStateToProps, null)(MapForm);