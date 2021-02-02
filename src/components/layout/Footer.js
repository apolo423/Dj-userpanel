import React, { Component } from "react";
import UserNextPlaylist from "./UserNextPlaylist";
import AudioPlayer from "react-h5-audio-player";
import { Link, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import store from "../../store";
import { setSongPath, setSongRunValue,songCount } from "../../services/auth/action";
import isEmpty from "../../utils/is-empty";
import Modal from "../Dashboard/Modal";
import $ from 'jquery';
class Footer extends Component {
  state = {
    modal: false,
    play: false,
    progress: 0,
    time: 0
  }

  componentDidMount() {
    // document.getElementById('x').addEventListener("angle", this.angleupdate);
  }

  angleupdate = (e) => {
    if ($('audio').length) {
      $('audio')[0].currentTime = $('audio')[0].duration * (e.data.angle/360);
    }
  }

  modalOpen = () => {
    this.setState({modal: true});
  }

  modalClose = () => {
    this.setState({modal: false});
  }

  stop = () => {
    $('audio')[0].pause();
    store.dispatch(setSongRunValue(false));
  }

  songclick = async (e, id) => {
    console.log("i zm click,",e,id)
    store.dispatch(setSongPath(e));
    store.dispatch(setSongRunValue(true));
    await this.props.songCount(id)
  };
  openPalylist = () => {
   //$("#playlist-song-btn").click(function(){
	    $(".dj-playlist-box").toggle(1000);
	  // });
  }
  playlistClose = () => {
   
	    $(".dj-playlist-box").hide(1000);
	 
	
  }
  

  async nextSong() {
    var songs = JSON.parse(localStorage.getItem("song") || "[]");
    var Currentsongs = JSON.parse(localStorage.getItem("Currentsong"));
    console.log("Currentsongs",Currentsongs)
    const isLargeNumber = element => element.id === Currentsongs.id;
   
    if (songs.length - 1 === songs.findIndex(isLargeNumber)) {
      console.log("hererr")
      localStorage.removeItem("Currentsong");
      localStorage.removeItem("song");
      
    }
    else {
      console.log("songs.findIndex(isLargeNumber)",songs.findIndex(isLargeNumber)+1)
  
      localStorage.setItem( "Currentsong", JSON.stringify(songs[songs.findIndex(isLargeNumber) + 1]));
      var lastPlayingSong = await JSON.parse(localStorage.getItem("Currentsong"));
      store.dispatch(setSongPath(lastPlayingSong.path));
      store.dispatch(setSongRunValue(true));
 

    }
  }

  listenSong = async (e) =>{
    this.setState({ 
      progress:  $('audio')[0].currentTime/$('audio')[0].duration*360,
      time: $('audio')[0].currentTime
    });
  }

  togglePlay = () => {
    const {play} = this.state;
    if (play) {
      $('audio')[0].pause();
    } else {
      $('audio')[0].play();
    }
  }

  twoDigit = (number) => {
    let str = '0'+number;
    return str.substr( str.length-2, 2);
  }

  render() {
    var songs = JSON.parse(localStorage.getItem("song") || "[]");
    var currentSong = JSON.parse(localStorage.getItem("Currentsong"));

    const { currentPlaylist, addToNext } = this.props;
    const { progress, time, modal } = this.state;


    return (
      <footer className={`bottom-song-palyer`}>
        <nav className={`navbar fixed-bottom navbar-expand-lg navbar-dark bg-light dj-navbar-btm  ${!modal ? "d-block" : "d-none"}`} style={{transition: 'all .3s ease-out'}}>
          <ul className="navbar-nav dj-audio-player">
            <a href="javascript:;" style={{color: 'black', fontWeight: '700', position: 'absolute', right: '5px', top: '-5px'}} onClick={(e) => this.stop(e)}>
              x
            </a>
            <a href="javascript:;" style={{position: 'absolute', transform: 'translateX(-50%)', left: '52%', top: '-24px', fontSize: '28px', background: '#ffffff', color: '#e8532b'}} onClick={ this.modalOpen }>
              <i class="fa fa-chevron-circle-up" aria-hidden="true" style={{border: '2px solid #e8532b', borderRadius: '50%', padding: '0 2px'}}></i>
            </a>
            <li className="ml-2 mr-2">
              <img width={70} src="images/dj.jpg" alt="" /> 
            </li>
            <li className="w-100 mr-1">
              <AudioPlayer
                src={this.props.auth.songPath}
                onPlay={e => this.setState({play: true})}
                onPause={e => this.setState({play: false})}
                onEnded={this.nextSong}
                autoPlay={this.props.auth.songRunValue}
                // other props here
                onListen={this.listenSong}
                listenInterval={1000}
              />
            </li>
            {/* <li className="dj-playlist-btm">
              <img width={50} src="images/user.jpg" alt="" />
              <article className="dj-song">
                <p>Hitch</p>
                <p>
                  <strong>Mold On (ft.Manny)</strong>
                </p>
              </article>
              <button onClick={this.modalOpen} id="playlist-song-btn"  className="playlist-btn">
                <i className="fa fa-indent" aria-hidden="true" />
              </button>
            </li> */}
          </ul>
        </nav>
               
      {/* <AudioPlayer
        src={this.props.auth.songPath}
        onPlay={e => this.setState({play: true})}
        onPause={e => this.setState({play: false})}
        onEnded={this.nextSong}
        autoPlay={this.props.auth.songRunValue}
        onListen={this.listenSong}
        listenInterval={1000}
        // other props here
      /> */}
      
      <div className={modal ? "modal d-block" : "modal d-none"}>
        <div className="modal-container" style={{padding: 0}}>
          <div style={{width: '660px', height: '700px', background: '#00000082', backgroundBlendMode: 'overlay', backgroundImage: 'url(/images/music_bg.jpg)', backgroundSize: 'cover'}}>
            <div className="debug">
              {`${ this.twoDigit(Number.parseInt(time/60)) }:${ this.twoDigit(Number.parseInt(time%60)) }`}
            </div>
            <div className="circle" id="x">
              <div className="dot" style={{transform: `rotate(${progress}deg)`}}></div>
            </div>
            <div style={{position: 'absolute', textAlign: 'center', width: '100%', top: '57%'}}>
              <h2 style={{color: 'white', fontStyle: 'italic', fontFamily: 'fantasy'}}>{ currentSong ? currentSong.name:''}</h2>
              <span style={{color: '#00e6db', fontWeight: '300'}}>DJ E-NICE</span>
            </div>            
            <a href="javascript:;" style={{color: 'white', position: 'absolute', right: '10px', top: '10px'}} onClick={(e) => this.modalClose(e)}>
              x
            </a>
            <div style={{position: 'absolute', textAlign: 'center', width: '100%', top: '80%'}}>
              <button type="button" style={{color: 'white', background: 'rgba(0,0,0,0)', border: '1px solid white', borderRadius: '50%', padding: '13px 18px', textAlign: 'center', fontSize: '18px', cursor: 'pointer', margin: '0 5px'}}>
                <i className="fas fa-backward"></i>
              </button>
              <button type="button" onClick={this.togglePlay} style={{color: 'white', background: 'rgba(0,0,0,0)', border: '1px solid white', borderRadius: '50%', padding: '20px 28px', textAlign: 'center', fontSize: '25px', cursor: 'pointer', margin: '0 5px'}}>
                <i className={this.state.play ? "fas fa-pause":"fas fa-play"}></i>
              </button>
              <button type="button" style={{color: 'white', background: 'rgba(0,0,0,0)', border: '1px solid white', borderRadius: '50%', padding: '13px 18px', textAlign: 'center', fontSize: '18px', cursor: 'pointer', margin: '0 5px'}}>
                <i className="fas fa-forward"></i>
              </button>
              <button type="button" style={{color: 'white', background: 'rgba(0,0,0,0)', padding: '13px 13px', textAlign: 'center', fontSize: '18px', cursor: 'pointer', margin: '0 5px'}}>
                <i className="fas fa-sync"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      </footer> 
    );
  }
}
const mapStateToProps = state => ({
  auth: state.authReducer
});
export default withRouter(
  connect(mapStateToProps, {
    setSongPath,
    songCount,
    setSongRunValue
  })(Footer)
);
