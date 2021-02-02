import React, { Component } from "react";
import { connect } from "react-redux";
import { updatePassword, setNotification } from "../../services/auth/action";
import Spinner from "../../utils/Spinner";
import classnames from "classnames";
import isEmpty from "../../utils/is-empty";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import store from "../../store";
import qs from "qs";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.props.setNotification(false);
    this.state = {
      password: "",
      confirm_password: "",

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
      password: this.state.password,
      confirm_password: this.state.confirm_password,
      token: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).djtk,
      role: "user"
    };

    this.props.updatePassword(user, this.state.errorCallback);
    };
    componentWillReceiveProps(nextProps) {

        if (!isEmpty(nextProps.auth.updatePassword)) {

            if (nextProps.auth.updatePassword === 'password update' && nextProps.auth.notfication === true) {
                store.dispatch(setNotification(false));
                swal("Password Update Successfully!", "Thanks", "success");
                this.setState({
                    password: '', confirm_password: ''
                })
                this.setState({ formError: [] })
                this.props.history.push('/')

            }
        }
    }

  render() {
    return (
      <div>
        {/*end header */}
        <section className="sign-up-main py-5">
          <div className="signup-form">
            <form onSubmit={this.onSubmit}>
              <h2>Update Password</h2>

              <div className="form-group">
                <input
                  type="password"
                  className={classnames("form-control", {
                    "is-invalid": !isEmpty(
                      this.state.formError.filter(item =>
                        item[0].includes("character") ? item : null
                      )
                    )
                  })}
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  placeholder="Password"
                  //   required="required"
                />
                {!isEmpty(
                  this.state.formError.filter(item =>
                    item[0].includes("character") ? item : null
                  )
                ) && (
                  <div className="invalid-feedback">
                    {
                      this.state.formError.filter(item =>
                        item[0].includes("character") ? item : null
                      )[0][1]
                    }
                  </div>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className={classnames("form-control", {
                    "is-invalid": !isEmpty(
                      this.state.formError.filter(item =>
                        item[0].includes("match") ? item : null
                      )
                    )
                  })}
                  name="confirm_password"
                  value={this.state.confirm_password}
                  onChange={this.onChange}
                  placeholder="Confirm Password"
                  //   required="required"
                />
                {!isEmpty(
                  this.state.formError.filter(item =>
                    item[0].includes("match") ? item : null
                  )
                ) && (
                  <div className="invalid-feedback">
                    {
                      this.state.formError.filter(item =>
                        item[0].includes("match") ? item : null
                      )[0][1]
                    }
                  </div>
                )}
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-primary btn-lg">
                  {"       "}{" "}
                  {this.props.auth.waitingFor.includes("Loading") ? (
                    <Spinner />
                  ) : null}
                  Update Password
                </button>
              </div>
              {/* <div className="text-center">
                <a href="dashboard">Back to Home page</a>
              </div> */}
            </form>
            <div className="text-center text-white">
              Already have an account? <Link to="/login">Login here</Link>
            </div>
          </div>
        </section>
        {/* footer */}
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
export default connect(mapStateToProps, { updatePassword, setNotification })(
  ChangePassword
);
