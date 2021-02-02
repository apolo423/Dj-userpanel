import React, { Component } from "react";
import { Link } from "react-router-dom";
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
  setSongPath,
  setSongRunValue,
  songCount,
  getPlaylistBySngleAdmin
} from "../../services/auth/action";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import qs from "qs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";

class PLaylistDetail extends Component {
  songclick = async (e, id) => {
    console.log("rrrr", e);
    store.dispatch(setSongPath(e));
    store.dispatch(setSongRunValue(true));

    await this.props.songCount(id);
  };

  render() {
    console.log("tttt pros", this.props.auth);
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
                  <img className="img-fluid" src="" alt="Banner Image" />
                </div>
                <div className="dj-playlist-title">
                  <h2 className="dj-heading text-white">
                    <button className="dj-playlist-play-btn">
                      <i className="fa fa-play-circle" />
                    </button>{" "}
                    
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container-fluid mb-5 pb-5">
          <div className="row py-3">
            {/* playlist */}
            <div className="col-9">
              <div className="row">
                <div className="col-12"></div>
                {/* admin follow  */}

                {/* dj playlist */}
                <div className="col-9" style={{ margin: "auto" }}>
                  <div className="dj-playlist-list">
                    {!isEmpty(this.props.auth.searchedSong) ? (
                      this.props.auth.searchedSong.map(item => (
                        <div
                          style={{cursor:'pointer'}}
                          className="dj-list-song"
                          onClick={() =>
                            this.songclick(item.path,item.id)
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
                    ) : (
                      <div
                        style={{ margin: "auto" }}
                        className="col-sm-6 col-md-6"
                      >
                        <div className="alert-message alert-message-danger">
                          <h4>Search results not found </h4>
                          <p>
                            Sorry we didn't find any results for.Check the
                            spelling, or try a different search..
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* end playlist */}
            {/* plsylist side bar */}
          </div>
        </section>
        <Footer></Footer>
        <ToastContainer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.authReducer
});
export default connect(mapStateToProps, {
  getAdminPlaylist,
  getSongInPlaylist,
  getUserProfile,
  followPlaylist,
  getPlaylistById,
  favortPlaylist,
  setNotification,
  setSongPath,
  setSongRunValue,
  songCount,
  getPlaylistBySngleAdmin
})(PLaylistDetail);
