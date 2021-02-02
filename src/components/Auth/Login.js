import React, { Component } from "react";
import { connect } from "react-redux";
import { login } from "../../services/auth/action";

import Spinner from "../../utils/Spinner";
import classnames from "classnames";
import isEmpty from "../../utils/is-empty";
import { Link, Redirect } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errorCallback: (key, value) => {
        this.setState({
          [key]: value
        });
      },
      formError: []
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      // this.props.history.push("/dashboard");
      // return <Redirect to='/dashboard' />
      window.location.href("/dashboard");
    }
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      [e.target.name.concat("error")]: ""
    });
  };

  onSubmit = async e => {
    e.preventDefault();
    this.setState({ formError: [] });
    var user = {
      email: this.state.email.trim(),
      password: this.state.password,
      role: "user"
    };
    this.props.login(user, this.state.errorCallback);
  };

  render() {
    return (
      <div>
        <section class="maincontent">
          <div class="logo-mobile">
            <img src="/images/logo.png" alt="" />
          </div>
          <div class="userAccessArea">
            <form onSubmit={this.onSubmit}>
                <h1>Sign In</h1>
                <div class="box d-flex">
                  <div class="icon">
                    <img src="/images/user.png" alt="" />
                  </div>
                  <input
                    className={classnames("form-control", {
                      "is-invalid": !isEmpty(
                        this.state.formError.filter(item =>
                          item[0].includes("username") ? item : null
                        )
                      )
                    })}
                    placeholder="Email / Username"
                    type="text"
                    required
                    value={this.state.email}
                    onChange={this.onChange}
                    name="email"
                  />
                  {!isEmpty(
                    this.state.formError.filter(item =>
                      item[0].includes("username") ? item : null
                    )
                  ) && (
                    <div className="invalid-feedback">
                      {
                        this.state.formError.filter(item =>
                          item[0].includes("username") ? item : null
                        )[0][1]
                      }
                    </div>
                  )}
                </div>
                <div class="box mb-1 d-flex">
                  <div class="icon">
                    <img src="/images/lock.png" alt="" />
                  </div>
                  <input
                    id="pasword-login"
                    className={classnames("form-control login-inputs", {
                      "is-invalid": !isEmpty(
                        this.state.formError.filter(item =>
                          item[0].includes("password") ? item : null
                        )
                      )
                    })}
                    placeholder="Password"
                    type="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    name="password"
                    required
                  />
                  {!isEmpty(
                    this.state.formError.filter(item =>
                      item[0].includes("password") ? item : null
                    )
                  ) && (
                    <div className="invalid-feedback">
                      {
                        this.state.formError.filter(item =>
                          item[0].includes("password") ? item : null
                        )[0][1]
                      }
                    </div>
                  )}
                </div>
                <div className="d-flex m-1" style={{justifyContent: 'space-between'}}>
                  <p>
                    <Link to="signup" className="forgotpass">
                      <strong>Don't have account?</strong>
                    </Link>
                  </p>
                  <p class="text-right">                  
                    <Link to="forget-password" className="forgotpass float-right">
                      <strong>Forgot password</strong>
                    </Link>
                  </p>
                </div>
                <button type="submit" class="btn btn-block btn-dark btn-lg">Sign In</button>
                <p class="text-right mt-2 bottom"> 
                or login with :
                  <a href="#"><i class="fab fa-facebook-f"></i></a>
                  <a href="#"><i class="fab fa-twitter"></i></a>
                  <a href="#"><i class="fab fa-google-plus-g"></i></a>
                </p>
            </form>
        </div>   
        </section>
        
        {/* footer */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.authReducer
});

export default connect(mapStateToProps, { login })(Login);
