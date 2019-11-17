import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { registerFormSubmitted } from "./actions";

/**
 * IRegisterFormProps specifies props passed in externally to RegisterForm component
 * @param dispatch the Redux dispatch function
 * @param password password // TODO: need to hash?
 * @param email user's email (effectively username) 
 */
interface IRegisterFormProps {
    dispatch: (action) => void,
    password: string,
    email: string
}

/**
 * IRegisterFormState specifies the local state interface for the RegisterForm
 * @param toMapFrame indicates whether or not to redirect to map frame (on success)
 * @param email user's email (functions as username)
 * @param password currently entered text in password input field
 * @param passwordCheck currently entered text in password match field
 * @param passwordsMatch indicates whether or not the previous two fields match
 * @param formValid is a flag indicating whether or not the form passes validation (and
 *                  can be submitted)
 */
interface IRegisterFormState {
    toMapFrame: boolean,
    email: string
    password: string,
    passwordCheck: string,
    passwordsMatch: boolean,
    formValid: boolean,
}

/**
 * RegisterForm provides a means to create new user accounts
 */
class RegisterForm extends Component<IRegisterFormProps, IRegisterFormState> {

    /** initialize local component state */
    state: IRegisterFormState = {
        toMapFrame: false,
        email: "",
        password: "",
        passwordCheck: "",
        passwordsMatch: false,
        formValid: false,
    };

    constructor(props) {
        /** call Component constructor, passing in props */
        super(props);
    }

    /**
     * called when user clicks submit button
     */
    private submitForm = (): void => {
        const userInfo = {
            email: this.state.email,
            password: this.state.password
        }

        /** make a POST request to registration endpoint */
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        }).then(async (response) => {
            if (response.status === 201) {
                /** success, parse body */
                const responseJson = await response.json();
                this.setState({
                    /** redirect to map frame */
                    toMapFrame: true
                }, () => {
                    /** dispatch action to set authenticationn state */
                    this.props.dispatch(registerFormSubmitted({
                        email: responseJson.email,
                        token: responseJson.token
                    }));
                    /** need to reload the page for redirect to work (toMapFrame) */
                    setTimeout(() => window.location.reload(), 1000);
                });
            } else if (response.status === 500) {
                // TODO: handle failed registration
            }
        });
    }

    /**
     * event handler which handles the event that text in the password input box has changed
     */
    private passwordChanged = (evt: { target: { value: string } }): void => {
        this.setState({
            password: evt.target.value
        }, () => {
            /** check against passwordCheck */
            if (this.state.password === this.state.passwordCheck
                && this.state.password.length > 0) {
                this.setState({
                    /** set passwordsMatch (used for validation) */
                    passwordsMatch: true
                }, this.validate);
            } else {
                this.setState({
                    passwordsMatch: false
                }, this.validate);
            }
        });
    }

    /**
     * event handler which handles the event that text in the passwordCheck input box has changed
     */
    private passwordCheckChanged = (evt: { target: { value: string } }): void => {
        this.setState({
            passwordCheck: evt.target.value
        }, () => {
            /** check against password */
            if (this.state.password === this.state.passwordCheck
                && this.state.password.length > 0) {
                this.setState({
                    /** set passwordsMatch (used for validation) */
                    passwordsMatch: true
                }, () => {
                    this.validate();
                });
            } else {
                this.setState({
                    passwordsMatch: false
                }, this.validate);
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
     * run form validation (called from event handlers)
     */
    private validate = (): void => {
        if (this.state.password.length > 0
         && this.state.email.length > 0
         && this.state.passwordsMatch) {
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
     *      - puts current name in search input field
     */
    componentDidMount(): void {
        this.setState({
            email: this.props.email
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
        if (this.props.email !== prevPropSnapshot.email) {
            this.setState({
                email: this.props.email
            })
        }
    }

    render() {
        if (this.state.toMapFrame) {
            return <Redirect to="/"></Redirect>
        }

        return(
            <div className="container" style={{height: "100%", width: "48%"}}>
            <form className="flex-column" style={{height: "32%", justifyContent: "space-around", alignItems: "space-between"}}>

                <h3>Register</h3>
                <div className="flex-row" style={{justifyContent: "space-between"}}>
                    <span className="flex-row" style={{width: "30%", justifyContent: "flex-end"}}>
                        Email
                    </span>
                    <input className="form-control" type="email" style={{width: "66%"}}
                        onChange={this.emailChanged}></input>
                </div>
                <div className="flex-row" style={{justifyContent: "space-between"}}>
                    <span className="flex-row" style={{width: "30%", justifyContent: "flex-end"}}>
                        Password
                    </span>
                    <input className="form-control" type="password" style={{width: "66%"}}
                        onChange={this.passwordChanged}></input>
                </div>
                <div className="flex-row" style={{justifyContent: "space-between"}}>
                    <span className="flex-row" style={{width: "30%", justifyContent: "flex-end"}}>
                        Confirm Password
                    </span>
                    <input className="form-control" type="password" style={{width: "66%"}}
                        onChange={this.passwordCheckChanged}></input>
                </div>
                <div className="flex-row" style={{justifyContent: "flex-end"}}>
                    <Button type="submit" disabled={!this.state.formValid} variant="primary" onClick={this.submitForm} style={{width: "66%"}}>
                        Register
                    </Button>
                </div>
                <div className="flex-row" style={{justifyContent: "flex-end"}}>
                    <span style={{width:"50%"}}>
                        Already registered?
                    </span>
                    <Link to="/login">Log in</Link>
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
export default connect(mapStateToProps, null)(RegisterForm);