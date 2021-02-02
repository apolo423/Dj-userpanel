import React, { Component } from "react";

export default class UserNextPlaylist extends Component {
  render() {
    return (
      <div className="card-body">
        <div className="dj-playlist-main">
          <a href="#">
            <img src="images/dj.jpg" />
            <div className="dj-playlist-box-inner">
              <p>BTS</p>
              <p>Show Me Love (Rimex)</p>
            </div>
            <p className="dj-playlist-p2">3:45</p>
          </a>
        </div>
      </div>
    );
  }
}
