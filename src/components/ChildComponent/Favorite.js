import React, { Component } from "react";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import isEmpty from "../../utils/is-empty";
import Spinner from "../../utils/newSpinner";
import store from "../../store";
import { getFavPlaylist } from "../../services/auth/action";

import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";

class Favorite extends Component {
  async componentDidMount() {
    await this.props.getFavPlaylist(this.props.auth.user.id);
  }
  render() {
    const { favPlaylist } = this.props.auth;
    const { waitingFor } = this.props.auth;
    return (
      <div id="tab01" className="tab-contents">
        <div className="row mt-5">
          {/* follow list */}
          {!isEmpty(favPlaylist) ? (
            favPlaylist.map(item => (
              <div className="col-6 col-sm-3 col-md-2">
                <div className="following-card-outer">
                  <img className="img-fluid" src={item.image} alt="Image" />
                  <p>
                    <strong>
                      <i className="fa fa-heart" /> {item.title}
                    </strong>
                  </p>
                  <p>{item.description}</p>
                </div>
              </div>
            ))
          ) : waitingFor.includes("Loading") ? (
            <Spinner />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.authReducer
});
export default connect(mapStateToProps, {
  getFavPlaylist
})(Favorite);
