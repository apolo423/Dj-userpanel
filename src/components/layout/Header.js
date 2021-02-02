import React, { Component } from "react";

// import store from "../../store";
// import { setLoginUser } from "../../Redux/action/AuthAction";
import UserNotification from "./UserNotification";
import $ from "jquery";
import ProfileDropDown from "./profiledropdown";
import isEmpty from "../../utils/is-empty";
import { connect } from "react-redux";
import store from "../../store";
import {
  getNotification,
  search,
  logoutUser,
  searchedSong,
  getUserProfile,
} from "../../services/auth/action";
import axios from "axios";
import { Link, Route, withRouter } from "react-router-dom";
import { baseUrl } from "../../helpers/baseUrl";

class Header extends Component {
  state = {
    keyword: "",
    showSearch: false,
  };

  componentDidMount() {
    this.props.getNotification();
    this.props.getUserProfile(this.props.auth.user.id);
  }
  openNotification = () => {
    $(".dj-notification-box").toggle(1000);
  };
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onSubmit = async (e) => {
    e.preventDefault();
    //await this.props.search(this.state.keyword)

    const response = await axios.get(
      `${baseUrl}/user/api/searchQuery/${this.state.keyword}`
    );

    store.dispatch(searchedSong(response.data));
    this.props.history.push("/search");
  };
  componentWillReceiveProps(nextProps) {
    //   if (!isEmpty(nextProps.auth.searchedSong)) {
    //       this.props.history.push("/search", { detail: nextProps.auth.searchedSong })
    // }
  }

  render() {
    console.log("ttt", this.props.auth.notificationList);
    return (
      <header className="top-bar">
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark dj-navbar">
          <a href="dashboard" className="navbar-brand">
            DJ
          </a>
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a href="dashboard" className="nav-link">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
          </ul>
          <form
            onSubmit={this.onSubmit}
            className="form-inline m-2  dj-search-bar"
          >
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              value={this.state.keyword}
              name="keyword"
              onChange={this.onChange}
              aria-label="Search"
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
            >
              <i className="fa fa-search" />
            </button>
          </form>
          <ul className="navbar-nav dj-profile-list">
            <li className="nav-item dropdown dj-dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  className="dj-user-pro-img"
                  src={this.props.auth.userProfile.imageUrl}
                  alt="Profile Image"
                />
                {this.props.auth.userProfile.name}
              </a>
              <div
                className="dropdown-menu dj-dropdown-inner"
                aria-labelledby="navbarDropdown"
              >
                <Link to="user-profile" className="dropdown-item">
                  <i className="fa fa-user" /> Profile
                </Link>
                <a href="favorite-follow" className="dropdown-item">
                  <i className="fa fa-heart" /> Likes & Following 
                </a>
                <Link
                  to="#"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.logoutUser();
                  }}
                >
                  <i className="fa fa-sign-out" /> Sign Out
                </Link>
              </div>
            </li>
            <li
              className="nav-item dj-bell-icon"
              onClick={this.openNotification}
            >
              <Link className="nav-link" id="bell-notify" to="#">
                <i className="fa fa-bell" />
              </Link>
            </li>
          </ul>
        </nav>
        <div className="dj-notification-box">
          <div className="card">
            <div className="card-header">Notifications</div>
            {!isEmpty(this.props.auth.notificationList) ? (
              this.props.auth.notificationList.map((item) => (
                <div className="card-body">
                  {/* notification */}
                  <div className="notification-main">
                    <img src={item.image} />
                    <p>{item.title}</p>
                    <a
                      href={`/playlist-detail?playlist=${item.id}&&owner=${item.playlistOwner}`}
                    >
                      <i className="fa fa-users" /> Go to Playlist
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <h1>No Notification</h1>
            )}
            {/* <div className="card-footer">
              <a>View All Notifications</a>
            </div> */}
          </div>
        </div>
      </header>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.authReducer,
});
export default withRouter(
  connect(mapStateToProps, {
    getNotification,
    getUserProfile,
    searchedSong,
    logoutUser,
    search,
  })(Header)
);
