import React, { Component } from "react";

// import isEmpty from '../../Helpers/is-empty'
import "react-toastify/dist/ReactToastify.min.css";
import "react-notifications/lib/notifications.css";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { connect } from "react-redux";
import Modal from "./Modal";
import {
  getUserProfile,
  editUser,
  setNotification,
} from "../../services/auth/action";
import Spinner from "../../utils/Spinner";
import classnames from "classnames";
import isEmpty from "../../utils/is-empty";
import store from "../../store";
import { ToastContainer, toast } from "react-toastify";
import swal from "sweetalert";
import { baseUrl } from "../../helpers/baseUrl";
import axios from "axios";
let formData;

class Profile extends Component {
  constructor(props) {
    super(props);
    store.dispatch(setNotification(false));
    this.state = {
      modal: false,
      name: "",
      username: "",
      email: "",
      selectedFile: null,
      errorCallback: (key, value) => {
        this.setState({
          [key]: value,
        });
      },
      formError: [],
    };
  }
  onChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      [e.target.name.concat("error")]: "",
    });
  };

  componentDidMount() {
    this.props.getUserProfile(this.props.auth.user.id);
  }
  modalOpen() {
    this.setState({ modal: true });
  }

  modalClose() {
    this.setState({
      modalInputName: "",
      modal: false,
    });
  }
  async componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.auth.editMessage)) {
      if (
        nextProps.auth.editMessage === "profile updated successfully" &&
        nextProps.auth.notfication === true
      ) {
        store.dispatch(setNotification(false));
        toast.success("profile updated successfully");
        this.props.getUserProfile(this.props.auth.user.id);
        this.setState({
          email: "",
          username: "",
          name: "",
        });
        this.setState({ formError: [] });
        if (this.state.selectedFile != null) {
          const res = await axios.post(`${baseUrl}/auth/upload`, formData);
          this.props.getUserProfile(this.props.auth.user.id);

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
  }

  onSubmit = async (e) => {
    e.preventDefault();
    if (this.state.selectedFile != null) {
      formData = new FormData();
      formData.append(
        "myFile",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
      formData.append("email", this.state.email.trim());
    }

    // Update the formData object

    var user = {
      email: this.state.email.trim(),
      username: this.state.username.trim(),
      name: this.state.name.trim(),
      userID: this.props.auth.user.id,
    };
    this.props.editUser(user, this.state.errorCallback);
  };

  render() {
    return (
      <div>
        <Header></Header>

        {/*end header */}
        {/* Playlist Banner */}
        <section className="dj-playlist-banner">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 p-0">
                <div className="dj-playlist-banner-img">
                  {/* <img class="img-fluid" src="" alt="Banner Image"> */}
                </div>
                <div className="dj-playlist-title user-profile-pic">
                  <h2 className="dj-heading text-white">
                    <img
                      className="user-profile-pic-img"
                      src={this.props.auth.userProfile.imageUrl}
                      alt="Profile"
                    />{" "}
                    <span>{this.props.auth.userProfile.name}</span>{" "}
                  </h2>
                </div>
                <div className="dj-profile-edit">
                  {/* <button>
                    <i className="fa fa-share-square" /> Share
                  </button> */}
                  <button onClick={(e) => this.modalOpen(e)}>
                    <i className="fa fa-edit" /> Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* end Playlist Banner */}
        {/* playlist wrapper section */}
        <section className="container-fluid mb-5 pb-5">
          <div className="App">
            <Modal
              show={this.state.modal}
              handleClose={(e) => this.modalClose(e)}
            >
              <form onSubmit={this.onSubmit} enctype="multipart/form-data">
                <h2>Edit Profile</h2>
                <div className="form-group">
                  <label>Enter Name:</label>
                  <input
                    type="text"
                    value={this.state.name}
                    name="name"
                    pattern="[A-Za-z,' ']{1,32}"
                    title="Name should only contain space,lowercase and uppercase letters. e.g. john "
                    onChange={this.onChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={this.state.username}
                    name="username"
                    pattern="[a-z]{1,15}"
                    required
                    title="Username should only contain lowercase letters. e.g. john and length should be less then 15 character"
                    onChange={this.onChange}
                    className={classnames("form-control", {
                      "is-invalid": !isEmpty(
                        this.state.formError.filter((item) =>
                          item[0].includes("username") ? item : null
                        )
                      ),
                    })}
                  />
                  {!isEmpty(
                    this.state.formError.filter((item) =>
                      item[0].includes("username") ? item : null
                    )
                  ) && (
                    <div className="invalid-feedback">
                      {
                        this.state.formError.filter((item) =>
                          item[0].includes("username") ? item : null
                        )[0][1]
                      }
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    required
                    name="email"
                    className={classnames("form-control", {
                      "is-invalid": !isEmpty(
                        this.state.formError.filter((item) =>
                          item[0].includes("email") ? item : null
                        )
                      ),
                    })}
                  />
                  {!isEmpty(
                    this.state.formError.filter((item) =>
                      item[0].includes("email") ? item : null
                    )
                  ) && (
                    <div className="invalid-feedback">
                      {
                        this.state.formError.filter((item) =>
                          item[0].includes("email") ? item : null
                        )[0][1]
                      }
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="file"
                    name="myImage"
                    onChange={this.onChangeHandler}
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">
                    {"       "}{" "}
                    {this.props.auth.waitingFor.includes("Loading") ? (
                      <Spinner />
                    ) : null}
                    Edit Profile
                  </button>
                </div>
              </form>
            </Modal>
          </div>

          <div className="row py-3">
            {/* playlist */}
            <div className="col-9 pt-5 mt-5">
              {/* Bio list */}
              <div className="row profile-bio py-3">
                <div className="col-4">
                  <p className="profile-bio-text">
                    <strong>Name:</strong>
                  </p>
                </div>
                <div className="col-8">
                  <p className="profile-bio-text">
                    {this.props.auth.userProfile.name}
                  </p>
                </div>
              </div>
              {/* Bio list */}
              <div className="row profile-bio py-3">
                <div className="col-4">
                  <p className="profile-bio-text">
                    <strong>Email</strong>
                  </p>
                </div>
                <div className="col-8">
                  <p className="profile-bio-text">
                    {this.props.auth.userProfile.email}
                  </p>
                </div>
              </div>
              {/* Bio list */}
              <div className="row profile-bio py-3">
                <div className="col-4">
                  <p className="profile-bio-text">
                    <strong>Username</strong>
                  </p>
                </div>
                <div className="col-8">
                  <p className="profile-bio-text">
                    {this.props.auth.userProfile.username}
                  </p>
                </div>
              </div>
              {/* Bio list */}
            </div>
            {/* end playlist */}
            {/* plsylist side bar */}
            {/*end plsylist side bar */}
          </div>
        </section>
        {/* end playlist wrapper section */}
        {/* footer */}
        {/* footer */}
        <ToastContainer></ToastContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.authReducer,
});

export default connect(mapStateToProps, {
  getUserProfile,
  editUser,
  setNotification,
})(Profile);
