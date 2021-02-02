import React, { Component } from "react";
import { connect } from "react-redux";
import { forgotPassword, setNotification } from "../../services/auth/action";
import Spinner from "../../utils/Spinner";
import classnames from "classnames";
import isEmpty from "../../utils/is-empty";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import store from "../../store";

class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.props.setNotification(false);
    this.state = {
      email: "",

      errorCallback: (key, value) => {
        this.setState({
          [key]: value
        });
      },
      formError: []
    };
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
      role: "user"
    };

    this.props.forgotPassword(user, this.state.errorCallback);
  };

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.auth.forgetPassword)) {
      if (
        nextProps.auth.forgetPassword === "Check your email" &&
        nextProps.auth.notfication === true
      ) {
        store.dispatch(setNotification(false));
        swal("Check your email to update password!", "Thanks", "success");
        this.setState({
          email: ""
        });
        this.setState({ formError: [] });
      }
    }
  }

  render() {
    return (
      <div>

<div class="mainbg_Dj">
          <div class="mainbg_inner">
            <div class="main_left">
              <div class="logoside">
                <a href="#"><img src="/images/logo.png" alt="LOGO"/></a>
              </div>
              <div class="formobile_image">        
                <div class="mobileimage">
                  <img src="/images/mobile-phone.png" alt="Image"/>
              </div>
              </div>
              <div class="form_side">
                <div class="logingfom">
                  <form onSubmit={this.onSubmit}>
                    <h2>Enter recovery email</h2>
                    <div class="form">
                      <div class="form-group">
                        <input
                          className={classnames("form-control", {
                            "is-invalid": !isEmpty(
                              this.state.formError.filter(item =>
                                item[0].includes("email") ? item : null
                              )
                            )
                          })}
                          type="email"
                          name="email"
                          value={this.state.email}
                          required
                          onChange={this.onChange}
                          placeholder="Email Address"
                          //   required="required"
                        />
                        {!isEmpty(
                          this.state.formError.filter(item =>
                            item[0].includes("email") ? item : null
                          )
                        ) && (
                          <div className="invalid-feedback">
                            {
                              this.state.formError.filter(item =>
                                item[0].includes("email") ? item : null
                              )[0][1]
                            }
                          </div>
                        )}
                        <span class="iconside"><img src="/images/user.png" alt="ICON"/></span>
                      </div>
                      <div class="form-group">
                        <span style={{color: '#ffffff',fontSize: '14px'}}>
                          Already have an account? <Link to="/" className="forgotpass">Login here</Link>
                        </span>
                      </div>
                      <div class="form-group">
                        <button class="btn btnsubmit"type="submit" >
                          {this.props.auth.waitingFor.includes("Loading") ? (
                            <Spinner />
                          ) : null}
                          Continue
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="main_right">
              <div class="mobileimage">
                <img src="/images/mobile-phone.png" alt="Image"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//get allblocks from the store
const mapStateToProps = state => ({
  auth: state.authReducer
});

//connect component to redux
//export default Login
export default connect(mapStateToProps, { forgotPassword, setNotification })(
  ForgetPassword
);
