import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { loginFormSubmitted } from "./actions";

/**
 * ILoginFormProps specifies the external props relevant to the LoginForm
 * @param dispatch is the global Redux dispatch function
 * @param isLoggedIn indicates whether or not the user is logged in
 * @param email is the email authentication property from the Redux store
 */
interface ILoginFormProps {
    dispatch: (action) => void,
    isLoggedIn: boolean,
    email: string,
}

/**
 * ILoginFormState specifies the local state interface for the LoginForm component
 * @param toMapFrame indicates whether or not to navigate to map frame
 * @param formValid used to validate the form (and enable/disable submit)
 */
interface ILoginFormState {
    toMapFrame: boolean
    email: string,
    password: string,
    formValid: boolean
}

/**
 * LoginForm provides an interface for existing users to log in
 */
class LoginForm extends Component<ILoginFormProps, ILoginFormState> {

    /** initialize local component state */
    state: ILoginFormState = {
        toMapFrame: false,
        email: "",
        password: "",
        formValid: false
    }

    constructor(props) {
        /** call Component constructor, passing in props */
        super(props);
    }

    /**
     * called when user clicks submit button
     */
    private submitForm = (): void => {
        const loginRequestInfo = {
            email: this.state.email,
            password: this.state.password
        }

        /** make a POST request to login endpoint to retrieve JWT token */
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginRequestInfo)
        }).then(async (response) => { 
            if (response.status === 200) {
                /** success, parse response */
                const responseJson = await response.json();
                this.setState({
                    /** navigate to map frame */
                    toMapFrame: true
                }, () => {
                    /** dispatch update to Redux state */
                    this.props.dispatch(loginFormSubmitted({
                        email: responseJson.email,
                        token: responseJson.token
                    }));
                    /** force a page reload */
                    setTimeout(() => window.location.reload(), 1000);
                });
            } else if (response.status === 500) {
                // TODO: handle failed login
            }
        });
    }

    /**
     * event handler which handles the event that the text in the email input box has changed
     */
    private emailChanged = (evt: { target: { value: string } }): void => {
        this.setState({
            email: evt.target.value
        }, this.validate);
    }

    /**
     * event handler which handles the event that text in the password input box has changed
     */
    private passwordChanged = (evt: { target: { value: string } }): void => {
        this.setState({
            password: evt.target.value
        }, this.validate);
    }

    /**
     * run form validation (called from event handlers)
     */
    private validate = (): void => {
        if (this.state.email.length > 0
         && this.state.password.length > 0) {
            this.setState({
                formValid: true
            });
        } else {
            this.setState({
                formValid: false
            });
        }
    }

    /**
     * React lifecycle hook implementation which is triggered when the component mounts
     *  on the DOM
     *  - populates component state     
     */
    componentDidMount(): void {
        this.setState({
            email: this.props.email
        });

        if (this.props.isLoggedIn) {
            this.setState({
                toMapFrame: true
            });
        }
    }

    /**
     * React lifecycle hook implementation which is triggered when the global Redux store
     *  is updated, triggering an update to the components props, which are mapped to the
     *  global Redux store
     *  - sets local state according to new props
     * @param prevPropSnapshot a snapshot of the components props before update
     */
    componentDidUpdate(prevPropSnapshot): void {
        if (this.props.email !== prevPropSnapshot.email) {
            this.setState({
                email: this.props.email
            })
        }
    }

    // TODO: implement validation
    render() {
        if (this.state.toMapFrame) {
            return <Redirect to="/"></Redirect>
        }
        return(            
            <div className="container" style={{height: "100%", width: "48%"}}>
                
                <form className="flex-column" style={{height: "26%", justifyContent: "space-around"}}>
                    <h3>Log In</h3>
                    <div className="flex-row" style={{justifyContent: "space-between"}}>
                        <span className="flex-row" style={{width: "25%", justifyContent: "flex-end"}}>
                            Email
                        </span>
                        <input className="form-control" type="email" style={{width: "66%"}}
                            onChange={this.emailChanged}></input>
                    </div>
                    <div className="flex-row" style={{justifyContent: "space-between"}}>
                        <span className="flex-row" style={{width: "25%", justifyContent: "flex-end"}}>
                            Password
                        </span>
                        <input className="form-control" type="password" style={{width: "66%"}}
                            onChange={this.passwordChanged}></input>
                    </div>
                    <div className="flex-row" style={{justifyContent: "flex-end"}}>
                        <Button variant="primary" disabled={!this.state.formValid} onClick={this.submitForm} style={{width: "66%"}}>
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
        email: state.authentication.email,
        isLoggedIn: state.authentication.isLoggedIn
    };
}

/**
 * Connect component to global Redux store
 */
export default connect(mapStateToProps, null)(LoginForm);