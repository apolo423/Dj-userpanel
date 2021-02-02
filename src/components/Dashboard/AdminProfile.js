import React, { Component } from "react";

import axios from "axios";
import { baseUrl } from "../../helpers/baseUrl";

// import isEmpty from '../../Helpers/is-empty'
import "react-toastify/dist/ReactToastify.min.css";
import "react-notifications/lib/notifications.css";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { connect } from "react-redux";
import isEmpty from "../../utils/is-empty";
import Spinner from "../../utils/Spinner";
import { getAdminPlaylist, getUserProfile,getAdminBio } from "../../services/auth/action";
import qs from "qs";

class AdminProfile extends Component {
  constructor() {
    super();
    this.state = {
      adminPlaylist: [],
      adminProfile: {},
      adminBio: {}
    };
  }

  async componentDidMount() {
    const adminID = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    }).admin;

    this.fetchAdminPlaylist(adminID);
    this.fetchAdminProfile(adminID);
    this.fetchAdminBio(adminID);
  }
  componentWillReceiveProps(nextProps) {
    //this.setState({ adminPlaylist: nextProps.auth.adminPlaylist });
  }

  fetchAdminProfile = async adminID => {
    const response = await axios.get(
      `${baseUrl}/user/api/getProfile?userID=${adminID}`
    );
    this.setState({
      adminProfile: response.data.userResponse[0]
    });
  }
  fetchAdminPlaylist = async adminID => {
    const response = await axios.get(
      `${baseUrl}/admin/playlist/getPlaylistByAdmin?adminID=${adminID}`
    );
    this.setState({
      adminPlaylist: response.data.playlistResponse
    });
  }
  fetchAdminBio = async adminID => {
    const response = await axios.get(
      `${baseUrl}/admin/api/getAdminBio?userID=${adminID}`
    );
    this.setState({
      adminBio: response.data.msg
    });
  }

  render() {
    const { waitingFor } = this.props.auth;
    const { adminPlaylist, adminProfile, adminBio } = this.state;
    return (
      <div>
        <Header></Header>
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
                      src={adminProfile.imageUrl}
                      alt="Profile"
                    />{" "}
                    <span>{adminProfile.name}</span>{" "}
                  </h2>
                </div>
                <div className="dj-profile-edit">
                  {/* <button>
                    <i className="fa fa-share-square" /> Share
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* end Playlist Banner */}
        {/* playlist wrapper section */}
        <section className="container-fluid mb-5 pb-5">
          <div className="row py-3">
            {/* playlist */}
            <div className="col-9 pt-5 mt-5">
              {/* Bio list */}

              {/* Bio list */}

              {/* Bio list */}

              {/* Bio list */}
              <div className="row profile-bio py-3">
                <div className="col-4">
                  <p className="profile-bio-text">
                    <strong>Bio {adminProfile.name}</strong>
                    <p>
                      {!isEmpty(adminBio)?adminBio.bio:null}
                    </p>
                  </p>
                </div>
              </div>
            </div>
            {/* end playlist */}
            {/* plsylist side bar */}
            <div className="col-3 mt-5 pt-3">
              <div className="dj-user-playlist-heading">
                <p>
                  <i className="fa fa-heart mr-1" />
                  <span>Playlists From this user </span> 
                </p>
              </div>
              {/* playlist from user */}
              {!isEmpty(adminPlaylist) ? (
                adminPlaylist.map(item => (
                  <div className="dj-user-playlist">
                    <img src="images/dj.jpg" alt="Playlist Thumbnail" />
                    <div className="dj-user-playlist-inner">
                      <p className="dj-user-inner-p1">{item.title}</p>
                      <h6>{item.description}</h6>
                      <p className="dj-user-inner-p2">
                        <span>
                          <i className="fa fa-heart" /> {item.noOfFavorite}
                        </span>{" "}
                        <span>
                          <i className="fa fa-retweet" /> {item.views}
                        </span>{" "}
                      </p>
                    </div>
                  </div>
                ))
              ) : waitingFor.includes("admin Loading") ? (
                <Spinner />
              ) : null}
            </div>
            {/*end plsylist side bar */}
          </div>
        </section>
        <Footer></Footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.authReducer
});

export default connect(mapStateToProps, { getAdminPlaylist, getUserProfile,getAdminBio })(
  AdminProfile
);
