import React, { Component } from "react";
import { connect } from "react-redux";
import { register, setNotification, upload } from "../../services/auth/action";
import Spinner from "../../utils/Spinner";
import classnames from "classnames";
import isEmpty from "../../utils/is-empty";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import store from "../../store";
import ImageUploader from "react-images-upload";
import axios from "axios";
import { baseUrl } from "../../helpers/baseUrl";

let formData;

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.props.setNotification(false);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      name: "",
      selectedFile: "",
      errorCallback: (key, value) => {
        this.setState({
          [key]: value,
        });
      },
      formError: [],
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      [e.target.name.concat("error")]: "",
    });
  };
  onChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    formData = new FormData();

    // Update the formData object
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    formData.append("email", this.state.email.trim());

    this.setState({ formError: [] });
    var user = {
      username: this.state.username,
      email: this.state.email.trim(),
      password: this.state.password,
      name: this.state.name.trim(),
      confirm_password: this.state.confirm_password,
      role: "user",
    };
   
    this.props.register(user, this.state.errorCallback);
  
  };

  async componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.auth.userRegister)) {
      if (
        nextProps.auth.userRegister === "Registered Successfully" &&
        nextProps.auth.notfication === true
      ) {
        store.dispatch(setNotification(false));
        this.props.history.push("/");
        swal(
          "You registered successfully!Verify your email address!",
          "Thanks!",
          "success"
        );

        this.setState({
          email: "",
          confirm_password: "",
          username: "",
          password: "",
          name: "",
          selectedFile: "",
        });
        this.setState({ formError: [] });
        const res = await axios.post(`${baseUrl}/auth/upload`, formData);
        

        if (res.status === 500) {
          swal(
            "Fail to upload image!",
            "Please login and try to upload your photot from profile!",
            "Fail"
          );
        }
      }
    }
  }

  render() {
    return (
      <div>
        {/*end header */}
        <section class="maincontent">
          <div class="logo-mobile">
            <img src="/images/logo.png" alt="" />
          </div>
          <div class="userAccessArea">
            <form onSubmit={this.onSubmit}>
                <h1>Sign Up</h1>
                <div class="box d-flex">
                  <div class="icon">
                    <img src="/images/user.png" alt="" />
                  </div>
                  <input
                    className={"form-control"}
                    placeholder="Name"
                    type="text"
                    required
                    value={this.state.name}
                    onChange={this.onChange}
                    name="name"
                  />
                </div>
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
                    placeholder="Username"
                    type="text"
                    required
                    pattern="[a-z]{1,15}"
                    title="Username should only contain lowercase letters. e.g. john and length should be less then 15 character"
                    value={this.state.username}
                    onChange={this.onChange}
                    name="username"
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
                <div class="box d-flex">
                  <div class="icon">
                    <img src="/images/user.png" alt="" />
                  </div>
                  <input
                    className={classnames("form-control", {
                      "is-invalid": !isEmpty(
                        this.state.formError.filter(item =>
                          item[0].includes("email") ? item : null
                        )
                      )
                    })}
                    placeholder="Email"
                    type="email"
                    required
                    value={this.state.email}
                    onChange={this.onChange}
                    name="email"
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
                </div>
                <div class="box mb-1 d-flex">
                  <div class="icon">
                    <img src="/images/lock.png" alt="" />
                  </div>
                  <input
                    className={classnames("form-control login-inputs", {
                      "is-invalid": !isEmpty(
                        this.state.formError.filter(item =>
                          item[0].includes("character") ? item : null
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
                <div class="box mb-1 d-flex">
                  <div class="icon">
                    <img src="/images/lock.png" alt="" />
                  </div>
                  <input
                    className={classnames("form-control login-inputs", {
                      "is-invalid": !isEmpty(
                        this.state.formError.filter(item =>
                          item[0].includes("match") ? item : null
                        )
                      )
                    })}
                    placeholder="Confirm Password"
                    type="password"
                    value={this.state.confirm_password}
                    onChange={this.onChange}
                    name="confirm_password"
                    required
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
                  <input
                    type="file"
                    name="myImage"
                    required
                    onChange={this.onChangeHandler}
                  />
                </div>
                <div className="d-flex m-1" style={{justifyContent: 'space-between'}}>
                  <p>
                    <Link to="/" className="forgotpass">
                      <strong>Already have an account?</strong>
                    </Link>
                  </p>
                </div>
                <button type="submit" class="btn btn-block btn-dark btn-lg">Sign Up</button>
            </form>
        </div>   
        </section>
      </div>
    );
  }
}

//get allblocks from the store
const mapStateToProps = (state) => ({
  auth: state.authReducer,
});

//connect component to redux
//export default Login
export default connect(mapStateToProps, { register, upload, setNotification })(
  SignUp
);
