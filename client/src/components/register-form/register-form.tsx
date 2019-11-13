import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { registerFormSubmitted } from "./actions";

interface IRegisterFormProps {
    dispatch: (action) => void,
    username: string,
    password: string,
    email: string
}

interface IRegisterFormState {
    toLogin: boolean,
    username: string,
    email: string
    password: string,
    passwordCheck: string,
    passwordsMatch: boolean,
    formValid: boolean,
}

/**
 * 
 */
class RegisterForm extends Component<IRegisterFormProps, IRegisterFormState> {
    
    state: IRegisterFormState = {
        toLogin: false,
        username: "",
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
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }

        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);

            this.props.dispatch(registerFormSubmitted({
                username: data.username    
            }));

            this.setState({
                toLogin: true
            });
        });

    }

    private usernameChanged = (evt: { target: { value: string } }): void => {
        this.setState({
            username: evt.target.value
        }, this.validate);
    }

    private passwordChanged = (evt: { target: { value: string } }): void => {
        this.setState({
            password: evt.target.value
        }, () => {
            if (this.state.password === this.state.passwordCheck
                && this.state.password.length > 0) {
                this.setState({
                    passwordsMatch: true
                }, this.validate);
            } else {
                this.setState({
                    passwordsMatch: false
                }, this.validate);
            }
        });
    }

    private passwordCheckChanged = (evt: { target: { value: string } }): void => {
        this.setState({
            passwordCheck: evt.target.value
        }, () => {
            if (this.state.password === this.state.passwordCheck
                && this.state.password.length > 0) {
                this.setState({
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

    private emailChanged = (evt: { target: { value: string } }): void => {
        this.setState({
            email: evt.target.value
        }, this.validate);
    }

    private validate = (): void => {
        if (this.state.username.length > 0
         && this.state.password.length > 0
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
            username: this.props.username
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
        if (this.props.username !== prevPropSnapshot.username) {
            this.setState({
                username: this.props.username
            });
        }
    }

    render() {
        if (this.state.toLogin) {
            return <Redirect to="/login"></Redirect>
        }

        return(            
            <div className="container" style={{height: "100%", width: "48%"}}>
            <form className="flex-column" style={{height: "26%", justifyContent: "space-around"}}>
            
                <h3>Register</h3>
                <div className="flex-row" style={{justifyContent: "space-between"}}>
                    <span className="flex-row" style={{width: "30%", justifyContent: "flex-end"}}>
                        Username
                    </span>
                    <input className="form-control" type="text" style={{width: "66%"}}
                        onChange={this.usernameChanged}></input>
                </div>
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
        username: state.authentication.username,
    };
}

/**
 * Connect component to global Redux store
 */
export default connect(mapStateToProps, null)(RegisterForm);