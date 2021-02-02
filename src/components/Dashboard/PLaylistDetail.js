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

class PLaylistDetail extends Component {
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
      ownerProfile: {},
      preview: {}
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

  previewSong = async (item) => {
    this.setState({preview: item});
  }

  removeFromUpNext = (item) => {
    try {
      var songs = [];
      var songArray = JSON.parse(localStorage.getItem("song") || "[]");
      songArray.map(song => {
        if (song.uuid !== item.uuid) 
        songs.push(song);
      });

      localStorage.setItem("song", JSON.stringify(songs));

      store.dispatch(setSongPath(songs[0].path));
      store.dispatch(setSongRunValue(true));

      var lastPlayingSong = JSON.parse(localStorage.getItem("Currentsong"));

      if (lastPlayingSong === null) {
        localStorage.setItem("Currentsong", JSON.stringify(songs[0]));
      }
    } catch (e) {
    }
  }

  // Add on next button
  addOnNext = async (e) => {
    let {preview} = this.state;
    if (!Object.keys(preview).length) return;
    preview.uuid = Date.now();

    try {
      var songArray = [];
      var songArray = JSON.parse(localStorage.getItem("song") || "[]");
      songArray.push(preview);
      localStorage.setItem("song", JSON.stringify(songArray));

      store.dispatch(setSongPath(songArray[0].path));
      store.dispatch(setSongRunValue(true));

      var lastPlayingSong = JSON.parse(localStorage.getItem("Currentsong"));

      if (lastPlayingSong === null) {
        localStorage.setItem("Currentsong", JSON.stringify(songArray[0]));
      }
    } catch (e) {
      swal("This playlist contain no song", "Try again!", "error");
    }
    // const playlistId = qs.parse(this.props.location.search, {
    //   ignoreQueryPrefix: true,
    // }).playlist;

    // try {
    //   console.log(
    //     "Irl is",
    //     `${baseUrl}/admin/playlist/getSonginPlaylist?playlistID=${playlistId}`
    //   );
    //   const response = await axios.get(
    //     `${baseUrl}/admin/playlist/getSonginPlaylist?playlistID=${playlistId}`
    //   );
    //   console.log("response song", response.data);
    //   if (response) {
    //     var songArray = [];
    //     var songArray = JSON.parse(localStorage.getItem("song") || "[]");
    //     response.data.songResponse.map((item) => {
    //       songArray.push(item);
    //     });

    //     localStorage.setItem("song", JSON.stringify(songArray));

    //     store.dispatch(setSongPath(songArray[0].path));
    //     store.dispatch(setSongRunValue(true));

    //     var lastPlayingSong = JSON.parse(localStorage.getItem("Currentsong"));

    //     if (lastPlayingSong === null) {
    //       localStorage.setItem("Currentsong", JSON.stringify(songArray[0]));
    //     }
    //     songArray = [];
    //   } else {
    //     swal(
    //       "We are fail to load the song in playlist Queue",
    //       "Try again!",
    //       "error"
    //     );
    //   }
    // } catch (e) {
    //   swal("This playlist contain no song", "Try again!", "error");
    // }
  };
  render() {
    const { waitingFor } = this.props.auth;
    const { ownerProfile, preview } = this.state;
    var songs = JSON.parse(localStorage.getItem("song") || "[]");
    var a;
    if (this.props.auth.songInPlaylist.length === 0) {
      a = (
        <React.Fragment>
          <p>This playlist contain no songs.</p>
        </React.Fragment>
      );
    }

    return (
      <div class="container-fluid">
        <Header></Header>
        <div class="header row">
            <div class="logo col-auto"><a href="#"><img src="/images/logo.png" alt="" /></a></div>
            <div class="col playing-list">
                <div class="row">
                    <div class="col-md-auto ">
                        <h4>Now Playing</h4>
                        <div class="nowplaying text-center">
                            <img src="/images/music.png" alt="" />
                            <h5>Roling Loud-live 2009</h5>
                            <p>DJ N C E</p>
                            <div class="time d-flex justify-content-between">
                                <span>1:45</span>
                                <span>24:45</span>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <h4>Up Next</h4>
                        <div class="music_wrap">
                            <ul class="music_list" style={{marginBottom: '0px'}}>
                                {!isEmpty(songs) ? (
                                  songs.map(item => (
                                    /*<div
                                      className="card-body"
                                      onClick={() => this.songclick(item.path,item.id)}
                                    >
                                      <div className="dj-playlist-main">
                                        <a href="#">
                                          <img src="images/dj.jpg" />
                                          <div className="dj-playlist-box-inner">
                                            <p>{item.name}</p>
                                            
                                          </div>
                                          
                                        </a>
                                      </div>
                                    </div>*/                                    
                                    <li onClick={() => this.songclick(item.path,item.id)} style={{width: '110px'}}>
                                      <div style={{position: 'relative'}}>
                                        <img src="images/dj.jpg" alt=""/>
                                        <a href="#" style={{whiteSpace: 'pre-wrap'}}>
                                          {item.name.substr(0, 20) + ( item.name.length >= 20 ? '...' : '')}
                                        </a>
                                        <a href="#" onClick={() => this.removeFromUpNext(item)} style={{position: 'absolute', top: '0', right: '10px'}}>
                                          <i class="fa fa-close"></i>
                                        </a>
                                      </div>
                                    </li>
                                  ))
                                ) : (
                                  <p>Currently no song in playlist </p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main_content row">
            <div class="col-lg-8">
                <div class="passage_details">
                    <div class="content_part">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="music-tumb-wrap">
                                    <img src="images/dj.jpg" alt="Song Thumbnail" />
                                    <div class="meta">
                                        <span><i class="fas fa-play"></i> 2K</span>
                                        <span><i class="fas fa-user"></i> 2.5K</span>
                                        <span><i class="fas fa-heart"></i> 578</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="w-100 mb-3 content_title d-flex justify-content-between">
                                    <h2 class="mb-0">{preview.name}</h2>
                                    <a className={`btn next_add ${!Object.keys(preview).length ? 'disabled' : ''}`}  style={{ cursor: "pointer", maxHeight: '35px' }} onClick={this.addOnNext} disabled={Object.keys(preview).length} >
                                      <i className="fa fa-indent" aria-hidden="true" /> Add to Next Up
                                    </a>
                                </div>
                                <p>{preview.description}</p>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque corporis quos voluptatem quasi? Tempora, et. Fugiat, assumenda est numquam labore vero reprehenderit debitis expedita nisi. Quas quia alias consequuntur ab!</p>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque corporis quos voluptatem quasi? Tempora, et. Fugiat, assumenda est numquam labore vero reprehenderit debitis expedita nisi. Quas quia alias consequuntur ab!</p>
                            </div>
                        </div>
                    </div>
                    <ul class="general-music-list">
                        {!isEmpty(this.state.songInPlaylist) ? (
                          this.state.songInPlaylist.map((item, idx) => (
                            <li className="d-flex" onClick={()=> this.previewSong(item)}>
                              <div className="sl">
                                  <button type="button" onClick={() =>
                                    this.songclick(item.path, item.playlistId, item.id)
                                  } style={{cursor: 'pointer'}}><i className="fas fa-play"></i></button>
                                  <span className="number">{idx+1}</span>
                              </div>
                              <div className="details">
                              {item.name}
                              </div>
                            </li>
                          ))
                        ) : waitingFor.includes("song Loading") ? (
                          <Spinner />
                        ) : (
                          <React.Fragment>
                            <p>This playlist contain no songs yet.</p>
                          </React.Fragment>
                        )}
                    </ul>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="sidebar">
                    <h4>Other Hot Playlists</h4>
                    <ul class="poular_list">
                      {!isEmpty(this.state.adminPlaylist) ? (
                        this.state.adminPlaylist.map((item, index) => (
                          
                        <li class="d-flex" onClick={() =>
                          this.onPlaylistClick(item.id, item.playlistOwner)
                        }>
                            <div class="music">
                                <img src="/images/dj.jpg" alt=""/>
                            </div>
                            <div class="media align-items-center">
                                <div class="number">
                                    {index+1}
                                </div>
                                <div class="media-body">
                                    <h6>{item.title}</h6>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        </li>
                        ))
                      ) : waitingFor.includes("admin Loading") ? (
                        <Spinner />
                      ) : null}
                    </ul>
                    <a href="#" class="view-all">View All</a>
                </div>
            </div>
        </div>
        <Footer></Footer>
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
})(PLaylistDetail);
