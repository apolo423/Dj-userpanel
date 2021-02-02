import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Footer extends Component {
  render() {
    return (
      <div className="card-body">
        {/* notification */}
        <div className="notification-main">
          <img src= {this.props.playlist.image} />
          <p>
          {this.props.playlist.title}
          </p>
          <Link to = {`/playlist-detail?playlist=${this.props.playlist.id}&&owner=${this.props.playlist.playlistOwner}`}>
            <i className="fa fa-users" /> Go to Playlist
          </Link>
        </div>
      </div>
    );
  }
}
