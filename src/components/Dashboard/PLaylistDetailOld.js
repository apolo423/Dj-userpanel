import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import isEmpty from "../../utils/is-empty";
import Spinner from "../../utils/newSpinner";

import store from "../../store";
import {
  getAdminPlaylist,
  getPlaylistById,
  getSongInPlaylist,
  getUserProfile,
  favortPlaylist,
  setNotification,
  followPlaylist,
  setFollower,
  setFavorite,
  setSongPath,
  songCount,
  setSongRunValue,
  getPlaylistBySngleAdmin,
} from "../../services/auth/action";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import qs from "qs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import axios from "axios";
import { baseUrl } from "../../helpers/baseUrl";
import $ from "jquery";
import { ConsoleWriter } from "istanbul-lib-report";

class PLaylistDetailOld extends Component {
  constructor(props) {
    super(props);
    store.dispatch(setNotification(false));
    this.state = {
      adminPlaylist: [],
      songInPlaylist: [],
      playlistName: "",
      playingSong: "",
      currentPlaylist: "",
      songInDb: "",
      playlistBanner: "",
      addToNext: [],
      ownerProfile: {}
    };
  }

  async componentWillMount() {
    var getSongArrayFromLocalDb = await JSON.parse(
      localStorage.getItem("song") || "[]"
    );

    // if no song in playlist let the user select from the song of playlist
    if (getSongArrayFromLocalDb.length === 0) {
    }
    // //Play the current song in playlist
    else {
      var lastPlayingSong = await JSON.parse(
        localStorage.getItem("Currentsong")
      );

      store.dispatch(setSongPath(lastPlayingSong.path));
      store.dispatch(setSongRunValue(true));
    }
  }

  async componentDidMount() {
    const owner = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).owner;
    const playlist = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).playlist;

    await this.props.getAdminPlaylist(owner);
    await this.props.getSongInPlaylist(playlist);
    //await this.props.getUserProfile(owner);
    await this.fetchOwnerProfile(owner);
    await this.props.getPlaylistById(playlist);
  }

  fetchOwnerProfile = async owner => {
    const response = await axios.get(
      `${baseUrl}/user/api/getProfile?userID=${owner}`
    );
    this.setState({
      ownerProfile: response.data.userResponse[0]
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ adminPlaylist: nextProps.auth.adminPlaylist });
    this.setState({ songInPlaylist: nextProps.auth.songInPlaylist });
    this.setState({ playlistName: nextProps.auth.playlistRecord.title });
    this.setState({ playlistBanner: nextProps.auth.playlistRecord.image });

    if (
      nextProps.auth.songInPlaylist.length !==
      this.props.auth.songInPlaylist.length
    ) {
    }

    if (!isEmpty(nextProps.auth.favMessage)) {
      if (
        nextProps.auth.favMessage === "view updated successfully" &&
        nextProps.auth.notfication === true
      ) {
        store.dispatch(setNotification(false));
        store.dispatch(setFavorite());

        toast("This playlist add to be your favorite playlist !", {
          position: toast.POSITION.TOP_RIGHT,
          className: "foo-bar",
        });
      }
    }
    if (!isEmpty(nextProps.auth.followMessage)) {
      if (
        nextProps.auth.followMessage === "follow successfully" &&
        nextProps.auth.notfication === true
      ) {
        store.dispatch(setNotification(false));
        store.dispatch(setFollower());
        toast("You follow the admin !", {
          position: toast.POSITION.TOP_RIGHT,
          className: "foo-bar",
        });
      }
    }
  }
  songclick = async (e, playlistId, id) => {
    store.dispatch(setSongPath(e));
    store.dispatch(setSongRunValue(true));
    console.log("SOmgiD", id);
    await this.props.songCount(id);
  };

  shareFacebook(url, text, image) {
    window.open(
      "http://facebook.com/sharer.php?s=100&p[url]=" +
        url +
        "&p[images][0]=" +
        image +
        "&p[title]=" +
        text,
      "fbshare",
      "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0"
    );
  }

  onPlaylistClick = async (e, owner) => {
    this.props.history.push(`playlist-detail?playlist=${e}&&owner=${owner}`);
    await this.props.getPlaylistById(e);
    await this.props.getSongInPlaylist(e);
  };

  FavoritePlaylist = async (e) => {
    const playlistId = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).playlist;
    const owner = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).owner;
    await this.props.favortPlaylist(playlistId, this.props.auth.user.id);
    await this.props.getAdminPlaylist(owner);
  };

  // Follow Playlist
  FollowPlaylist = async (e) => {
    const owner = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).owner;

    await this.props.followPlaylist(owner, this.props.auth.user.id);
    //await this.props.getUserProfile(owner);
    await this.fetchOwnerProfile(owner);
  };

  // Add on next button
  addOnNext = async (e) => {
    const playlistId = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).playlist;

    try {
      console.log(
        "Irl is",
        `${baseUrl}/admin/playlist/getSonginPlaylist?playlistID=${playlistId}`
      );
      const response = await axios.get(
        `${baseUrl}/admin/playlist/getSonginPlaylist?playlistID=${playlistId}`
      );
      console.log("response song", response.data);
      if (response) {
        var songArray = [];
        var songArray = JSON.parse(localStorage.getItem("song") || "[]");
        response.data.songResponse.map((item) => {
          songArray.push(item);
        });

        localStorage.setItem("song", JSON.stringify(songArray));

        store.dispatch(setSongPath(songArray[0].path));
        store.dispatch(setSongRunValue(true));

        var lastPlayingSong = JSON.parse(localStorage.getItem("Currentsong"));

        if (lastPlayingSong === null) {
          localStorage.setItem("Currentsong", JSON.stringify(songArray[0]));
        }
        songArray = [];
      } else {
        swal(
          "We are fail to load the song in playlist Queue",
          "Try again!",
          "error"
        );
      }
    } catch (e) {
      swal("This playlist contain no song", "Try again!", "error");
    }
  };
  render() {
    const { waitingFor } = this.props.auth;
    const { ownerProfile } = this.state;
    var a;
    if (this.props.auth.songInPlaylist.length === 0) {
      a = (
        <React.Fragment>
          <p>This playlist contain no songs.</p>
        </React.Fragment>
      );
    }

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
                  <img
                    className="img-fluid"
                    src={this.state.playlistBanner}
                    alt="Banner Image"
                  />
                </div>
                <div className="dj-playlist-title">
                  <h2 className="dj-heading text-white">
                    <button className="dj-playlist-play-btn">
                      <i className="fa fa-play-circle" />
                    </button>{" "}
                    {this.state.playlistName}
                  </h2>
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
            <div className="col-9">
              <div className="row">
                <div className="col-12">
                  <div className="dj-palylist-fav-list pb-3">
                    <ul className="nav">
                      <li
                        className="nav-item"
                        style={{ cursor: "pointer" }}
                        onClick={this.FavoritePlaylist}
                      >
                        <a className="nav-link">
                          {this.props.auth.waitingFor.includes(
                            "Fav Loading"
                          ) ? (
                            <Spinner />
                          ) : null}
                          <i className="fa fa-heart" /> Favorites
                        </a>
                      </li>

                      <li className="nav-item">
                        <a
                          className="nav-link"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            this.shareFacebook(
                              "http://72.14.189.240:3000/login",
                              "testing website",
                              this.state.playlistBanner
                            )
                          }
                        >
                          <i className="fa fa-share-square" /> Share
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          style={{ cursor: "pointer" }}
                          onClick={this.addOnNext}
                        >
                          <i className="fa fa-indent" aria-hidden="true" /> Add
                          to Next Up
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* admin follow  */}
                <div className="col-3">
                  <div className="dj-admin-follow">
                    <img
                      className="img-fluid"
                      src={ownerProfile.imageUrl}
                      alt="Admin Image"
                    />
                    <h6 className="admin-name">
                      {ownerProfile.name}
                    </h6>
                    <p>
                      <i className="fa fa-users" />{" "}
                      <span>{ownerProfile.noOfFollower}</span>{" "}
                    </p>
                    <a href="#" onClick={this.FollowPlaylist}>
                      {this.props.auth.waitingFor.includes("Follow Loading") ? (
                        <Spinner />
                      ) : null}
                      <i className="fa fa-user" />
                      Follow
                    </a>
                  </div>
                </div>
                {/* dj playlist */}
                <div className="col-9">
                  <div className="dj-playlist-list">
                    {!isEmpty(this.state.songInPlaylist) ? (
                      this.state.songInPlaylist.map((item) => (
                        <div
                          style={{ cursor: "pointer" }}
                          className="dj-list-song"
                          onClick={() =>
                            this.songclick(item.path, item.playlistId, item.id)
                          }
                        >
                          <img src="images/dj.jpg" alt="Song Thumbnail" />
                          <div className="song-list-title">
                            <p className="dj-list-song-title">
                              {item.name} - <span>{item.deccription}</span>
                            </p>
                          </div>
                          <p className="dj-list-song-p-btn">
                            <a href="#">
                              <i className="fa fa-play" />
                            </a>
                            <span>{item.views}</span>
                          </p>
                        </div>
                      ))
                    ) : waitingFor.includes("song Loading") ? (
                      <Spinner />
                    ) : (
                      <React.Fragment>
                        <p>This playlist contain no songs yet.</p>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* end playlist */}
            {/* plsylist side bar */}
            <div className="col-3 mt-5 pt-3">
              <div className="dj-user-playlist-heading">
                <p>Playlists From this user</p>
              </div>
              {/* playlist from user */}

              {/* {this.state.adminPlaylist.map(item => ( */}
              {!isEmpty(this.state.adminPlaylist) ? (
                this.state.adminPlaylist.map((item) => (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      this.onPlaylistClick(item.id, item.playlistOwner)
                    }
                    className="dj-user-playlist"
                  >
                    <img src="images/dj.jpg" alt="Playlist Thumbnail" />
                    <div className="dj-user-playlist-inner">
                      <p className="dj-user-inner-p1">{item.description}</p>
                      <h6>{item.title}</h6>
                      <p className="dj-user-inner-p2">
                        <span>
                          <i className="fa fa-heart" /> {item.noOfFavorite}
                        </span>{" "}
                        <span>
                          <i className="fa fa-eye-slash" aria-hidden="true" />{" "}
                          {item.views}
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
        {/* end playlist wrapper section */}
        {/* footer */}
        {/* footer */}
        {/*<Footer currentPlaylist={this.state.currentPlaylist}></Footer>*/}
        <ToastContainer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.authReducer,
});
export default connect(mapStateToProps, {
  getAdminPlaylist,
  getSongInPlaylist,
  getUserProfile,
  followPlaylist,
  getPlaylistById,
  favortPlaylist,
  setSongPath,
  setFollower,
  setFavorite,
  songCount,
  setSongRunValue,
  setNotification,
  getPlaylistBySngleAdmin,
})(PLaylistDetailOld);
