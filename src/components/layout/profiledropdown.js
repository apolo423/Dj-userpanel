import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser, getUserProfile } from "../../services/auth/action";
import $ from 'jquery';

class profiledropdown extends Component {
  componentDidMount() {
    this.props.getUserProfile(this.props.auth.user.id);
  }

 
  render() {
    
    return (
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
            <a href="user-profile" className="dropdown-item">
              <i className="fa fa-user" /> Profile
            </a>
            <a href="favorite-follow" className="dropdown-item">
              <i className="fa fa-heart" /> Favorites
            </a>
            <a href="favorite-follow" className="dropdown-item">
              <i className="fa fa-users" /> Following
            </a>

            <Link
              to="#"
              className="dropdown-item"
              onClick={e => {
                e.preventDefault();
                this.props.logoutUser();
              }}
            >
              <i className="fa fa-sign-out" /> Sign Out
            </Link>
          </div>
        </li>
        <li className="nav-item dj-bell-icon">
          <Link className="nav-link" id="bell-notify" to="#">
            <i className="fa fa-bell" />
          </Link>
        </li>
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.authReducer
});

export default connect(mapStateToProps, { logoutUser,getUserProfile })(profiledropdown);
