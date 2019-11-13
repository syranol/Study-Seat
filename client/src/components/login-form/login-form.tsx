import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { loginFormSubmitted } from "./actions";

interface ILoginFormProps {
    dispatch: (action) => void,
    username: string,
    password: string,
}

interface ILoginFormState {
    toMapFrame: boolean
    username: string,
    password: string,
    formValid: boolean
}

/**
 * 
 */
class LoginForm extends Component<ILoginFormProps, ILoginFormState> {
    
    state: ILoginFormState = {
        toMapFrame: false,
        username: "",
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
            username: this.state.username,
            password: this.state.password
        }

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginRequestInfo)
        }).then((response) => { 
            if (response.status === 200) {
                this.setState({
                    toMapFrame: true
                });
                return response.json();
            } else {
                // TODO: handle failed login
                return response.json();
            }
        }).then((data) => {
            this.props.dispatch(loginFormSubmitted({
                username: data.username
            }));
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
        }, this.validate);
    }

    private validate = (): void => {
        if (this.state.username.length > 0
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
                            Username
                        </span>
                        <input className="form-control" type="text" style={{width: "66%"}}
                            onChange={this.usernameChanged}></input>
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
        username: state.authentication.username
    };
}

/**
 * Connect component to global Redux store
 */
export default connect(mapStateToProps, null)(LoginForm);