import React, { Component } from "react";
import { connect } from "react-redux";

import { Link, Redirect } from "react-router-dom";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import isEmpty from "../../utils/is-empty";
import Spinner from "../../utils/Spinner";
import { getAllAdmin, getAllPlaylist } from "../../services/auth/action";
import ShowTopAdmin from "../ChildComponent/ShowTopAdmin";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

class Dashboard extends Component {
  state = {
    adminList: [],
    playlist: []
  };
  async componentWillMount() {
    await this.props.getAllAdmin();
    await this.props.getAllPlaylist();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ adminList: nextProps.auth.allAdminList });
    this.setState({ playlist: nextProps.auth.playlistList });
  }

  render() {
    const { waitingFor } = this.props.auth;

    return (
      <div>
        <Header></Header>
        {/*end header */}
        {/* DJ Features  */}
        <section className="my-5">
          <div className="container mt-5">
            <div className="row my-3">
              <div className="col-12">
                <h2 className="dj-heading">Top Genres</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <ShowTopAdmin
                  data={this.state.adminList}
                  key={this.state.adminList.id}
                ></ShowTopAdmin>
              </div>
            </div>
          </div>
        </section>
        {/*End DJ Features  */}
        {/* Top Ranked Playlist  */}
        <section className="my-5 pb-5">
          <div className="container mt-5">
            <div className="row my-3">
              <div className="col-12">
                <h2 className="dj-heading">Top Playlists</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {/* owl carosel */}
                {/* ../../// */}

                {/* <div className="item">
                  <div className="card dj-card"> */}
                <OwlCarousel className="owl-theme" margin={10} nav>
                  {!isEmpty(this.props.auth.playlistList) ? (
                    this.props.auth.playlistList.map(item => (
                      <Link
                        to={`/playlist-detail?playlist=${item.id}&&owner=${item.playlistOwner}`}
                      >
                        <div className="item">
                          <div className="card dj-card">
                            <img
                              className="card-img-top"
                              src={item.image}
                              alt="Card image cap"
                            />
                            <div className="card-body dj-card-body">
                              <h3>
                                <a href="#">R&amp;B {item.title}</a>
                              </h3>
                              <p>{item.name}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <h1>No playlist found</h1>
                  )}
                </OwlCarousel>
              </div>
            </div>
          </div>
        </section>
        {/*End Top Ranked Playlist  */}
        {/* footer */}
      </div>
    );
  }
}
//get allblocks from the store

const mapStateToProps = state => ({
  auth: state.authReducer
});
export default connect(mapStateToProps, { getAllAdmin, getAllPlaylist })(
  Dashboard
);
