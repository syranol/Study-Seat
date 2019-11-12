import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";

/**
 * 
 */
class LoginForm extends Component<{ }, { }> {
    
    constructor(props) {
        /** call Component constructor, passing in props */
        super(props);
    }

    /**
     * called when user clicks submit button
     */
    private submitForm = (): void => {



        fetch("/login", {
            method: "POST",
            body: JSON.stringify({ })
        }).then((response) => { console.log(response); });
    
    
    
    }

    /**
     * React lifecycle hook implementation which is triggered when the component mounts
     *  on the DOM
     *  - populates component state
     *      - puts current location name in search input field
     */
    componentDidMount(): void {
        
    }

    /**
     * React lifecycle hook implementation which is triggered when the global Redux store
     *  is updated, triggering an update to the components props, which are mapped to the
     *  global Redux store
     *  - sets local state according to new props
     * @param prevPropSnapshot a snapshot of the components props before update
     */
    componentDidUpdate(prevPropSnapshot): void {
        
    }

    // TODO: implement validation
    render() {
        return(            
            <div className="container" style={{height: "100%", width: "48%"}}>
                
                <form className="flex-column" style={{height: "26%", justifyContent: "space-around"}}>
                    <h3>Log In</h3>
                    <div className="flex-row" style={{justifyContent: "space-between"}}>
                        <span className="flex-row" style={{width: "25%", justifyContent: "flex-end"}}>
                            Username
                        </span>
                        <input className="form-control" type="text" style={{width: "66%"}}></input>
                    </div>
                    <div className="flex-row" style={{justifyContent: "space-between"}}>
                        <span className="flex-row" style={{width: "25%", justifyContent: "flex-end"}}>
                            Password
                        </span>
                        <input className="form-control" type="password" style={{width: "66%"}}></input>
                    </div>
                    <div className="flex-row" style={{justifyContent: "flex-end"}}>
                        <Button variant="primary" onClick={this.submitForm} style={{width: "66%"}}>
                            Log In
                        </Button>
                    </div>
                    <div className="flex-row" style={{justifyContent: "flex-end"}}>
                        <span style={{width:"50%"}}>
                            Don't have an account? 
                        </span>
                        <Link to="/register">Register</Link>
                    </div>
                </form>
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

    };
}

/**
 * Connect component to global Redux store
 */
export default connect(mapStateToProps, null)(LoginForm);