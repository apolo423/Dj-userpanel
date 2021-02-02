import React, { Component } from "react";
import { getFollowadmin } from "../../services/auth/action";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import isEmpty from "../../utils/is-empty";
import Spinner from "../../utils/newSpinner";
import store from "../../store";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";

class Following extends Component {
  async componentDidMount() {
    await this.props.getFollowadmin(this.props.auth.user.id);
    
  }
  render() {
    const { followPlaylist } = this.props.auth;
    const { waitingFor } = this.props.auth;
    return (
      <div id="tab02" className="tab-contents">
        <div className="row mt-5">
          {/* follow list */}
          {!isEmpty(followPlaylist) ? (
            followPlaylist.map(item => (
          <div className="col-6 col-sm-3 col-md-2">
            <div className="following-card-outer">
              <img className="img-fluid" src={item.imageUrl} alt="Image" />
              <p>
                <strong>
                      <i className="fa fa-heart" /> {item.name}
                </strong>
              </p>
                  <p>{item.name}</p>
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
  getFollowadmin
})(Following);
