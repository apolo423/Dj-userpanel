import {
  ADD_LOADER,
  GET_ERRORS,
  UPDATE_PASSWORD,
  FORGET_PASSWORD,
  REMOVE_LOADER,
  SET_CURRENT_USER,
  REGISTER_USER,
  GET_ALL_ADMIN,
  USER_PROFILE,
  GET_FOLLOW_ADMIN,
  GET_ALL_PLAYLIST,
  SEARCH,
  BIO,
  SEARCHED_SONG,
  GET_ALL_PLAYLIST_ADMIN,
  GET_ALL_ADMIN_SONG,
  NOTIFICATION,
  GET_FAV_PLAYLIST,
  EDIT_USER,
  SONGPATH,
  GET_NOTIFICATION,
  GET_ADMIN_PLAYLIST,
  FAVORITE_PLAYLIST,
  SONG_RUN,
  FOLLOW_PLAYLIST,
  GET_SPECIFIC_PLAYLIST
} from "./type";
import axios from "axios";
import "react-toastify/dist/ReactToastify.min.css";
import swal from "sweetalert";
import { baseUrl } from "../../helpers/baseUrl";
import jwt_decode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";

export const login = (userData, errorCallback) => async dispatch => {
 
  dispatch({
    type: ADD_LOADER,
    payload: "Loading"
  });

  try {
    const res = await axios.post(`${baseUrl}/auth/login`, userData);
    console.log("rrs",res.data)
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    const { token } = res.data;
    localStorage.setItem("jwtToken", token);

    setAuthToken(token);
    const decodedUser = jwt_decode(token);
    dispatch(setCurrentUser(decodedUser));
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });
    if (err.message === "Network Error") {
      swal("Server is not responding", "Try again!", "error");
    } else if (err.response) {
      const errors = [];

      if (err.response && err.response.data.msg.includes("username")) {
        errors.push(["username", err.response.data.msg]);
      } else if (err.response && err.response.data.msg.includes("password")) {
        errors.push(["password", err.response.data.msg]);
      } else if (err.response && err.response.data.msg.includes("verify")) {
        swal("Please verify your email address first", "Thanks!", "error");
      } else if (err.response.status === 500) {
        swal("Something went wrong", "Try again!", "error");
      } else if ((err.message = "Request failed with status code 404")) {
        swal("There is problem in server", "Try again!", "error");
      }

      errorCallback("formError", errors);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
  }
};

// User registration
export const register = (user, errorCallback) => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Loading"
  });

  try {
    const response = await axios.post(`${baseUrl}/auth/register`, user);

    dispatch({
      type: NOTIFICATION,
      payload: true
    });
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    dispatch({
      type: REGISTER_USER,
      payload: response.data.msg
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });
    if (err.message === "Network Error") {
      swal("Server is not responding", "Try again!", "error");
    } else if (err.response) {
      const errors = [];

      if (err.response && err.response.data.msg.includes("email")) {
        errors.push(["email", err.response.data.msg]);
      } else if (err.response && err.response.data.msg.includes("username")) {
        errors.push(["username", err.response.data.msg]);
      } else if (err.response && err.response.data.msg.includes("character")) {
        errors.push(["character", err.response.data.msg]);
      } else if (err.response && err.response.data.msg.includes("match")) {
        errors.push(["match", err.response.data.msg]);
      } else if (err.response && err.response.data.msg.includes("not")) {
        swal(
          "Something went wrong",
          "Problem in sending email.Make sure your internet connection should be active!",
          "error"
        );
      } else if (err.response && err.response.data.msg.includes("failed")) {
        swal("Register request failed", "Try again!", "error");
      } else if (err.response.status === 500) {
        swal("Something went wrong", "Try again!", "error");
      } else if ((err.message = "failed with status code 404")) {
        swal("There is problem in server", "Try again!", "error");
      }

      errorCallback("formError", errors);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
  }
};

// Forget password
export const forgotPassword = (data, errorCallback) => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Loading"
  });
  try {
    const res = await axios.post(`${baseUrl}/auth/forget-password`, data);

    dispatch({
      type: NOTIFICATION,
      payload: true
    });
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    dispatch({
      type: FORGET_PASSWORD,
      payload: res.data.msg
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    if (err.message === "Network Error") {
      swal("Server is not responding", "Try again!", "error");
    } else if (err.response) {
      const errors = [];
      if (err.response && err.response.data.msg.includes("email")) {
        errors.push(["email", err.response.data.msg]);
      } else if (err.response && err.response.data.msg.includes("sending")) {
        swal(
          "Something went wrong",
          "Problem in sending email.Make sure your internet connection should be active!",
          "error"
        );
      } else if (err.response && err.response.data.msg.includes("Something")) {
        swal("Something went wrong", "Try again!", "error");
      } else if (err.response.status === 500) {
        swal("Something went wrong", "Try again!", "error");
      } else if ((err.message = "failed with status code 404")) {
        swal("There is problem in server", "Try again!", "error");
      }

      errorCallback("formError", errors);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
  }
};

//Update password
export const updatePassword = (data, errorCallback) => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Loading"
  });
  try {
    const response = await axios.post(`${baseUrl}/auth/change-password`, data);

    dispatch({
      type: NOTIFICATION,
      payload: true
    });
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    dispatch({
      type: UPDATE_PASSWORD,
      payload: response.data.msg
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    if (err.message === "Network Error") {
      swal("Server is not responding", "Try again!", "error");
    } else if (err.response) {
      if (err.response.status === 500) {
        swal("Something went wrong", "Internel Server Error!", "error");
      }

      const errors = [];
      if (err.response && err.response.data.msg.includes("character")) {
        errors.push(["character", err.response.data.msg]);
      } else if (err.response && err.response.data.msg.includes("match")) {
        errors.push(["match", err.response.data.msg]);
      } else if (err.response && err.response.data.msg.includes("Exist")) {
        swal(
          "Your token has been expired.",
          "Click on forget email to get updated link!",
          "error"
        );
      } else if ((err.message = "failed with status code 404")) {
        swal("There is problem in server", "Try again!", "error");
      }

      errorCallback("formError", errors);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
  }
};

//save user in state
export const setCurrentUser = decodedUser => {
  return {
    type: SET_CURRENT_USER,
    payload: decodedUser
  };
};

// logout user
export const logoutUser = () => dispatch => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};

// user notification
export const setNotification = () => {
  return {
    type: NOTIFICATION,
    payload: false
  };
};

export const setFavorite = () => {
  return {
    type: FAVORITE_PLAYLIST,
    payload: ""
  };
};

export const setFollower = () => {
  return {
    type: FOLLOW_PLAYLIST,
    payload: ""
  };
};

export const setSongPath = path => {
  return {
    type: SONGPATH,
    payload: path
  };
};

export const setSongRunValue = value => {
  return {
    type: SONG_RUN,
    payload: value
  };
};

// User registration
export const upload = options => async dispatch => {
  try {
    const response = await axios.post(`${baseUrl}/auth/upload`, options);
  } catch (err) {}
};

//get all inactive ship
export const getAllAdmin = id => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Loading"
  });

  try {
    const response = await axios.get(`${baseUrl}/user/api/getAllAdmin`);
    console.log("Response all admin",response.data)

    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    dispatch({
      type: GET_ALL_ADMIN,
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    if (err.message === "Network Error") {
      //swal("Server is not responding", "Try again!", "error");
      dispatch({
        type: GET_ALL_ADMIN,
        payload: []
      });
    }
    if (err.response && err.response.data.msg.includes("not")) {
      //swal("We are fail to get top admin", "Try again!", "error");
      dispatch({
        type: GET_ALL_ADMIN,
        payload: []
      });
    } else if (err.response) {
      if (err.response.status === 500) {
        swal("Something went wrong", "Fail to get record!", "error");
      } else {
        dispatch({
          type: GET_ALL_ADMIN,
          payload: []
        });
      }
    }
  }
};

// Get the user Profile

export const getUserProfile = id => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "profile Loading"
  });
  try {
    const response = await axios.get(
      `${baseUrl}/user/api/getProfile?userID=${id}`
    );

    dispatch({
      type: USER_PROFILE,
      payload: response.data.userResponse[0]
    });
    dispatch({
      type: REMOVE_LOADER,
      payload: "profile Loading"
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "profile Loading"
    });

    if (err.response) {
      if (err.response.status === 500) {
        swal("Something went wrong", "Fail to get record!", "error");
      } else {
        dispatch({
          type: USER_PROFILE,
          payload: {}
        });
      }
    }
    if (err.message === "Network Error") {
      swal(
        "Fail to get user profile,Server issue",
        "Fail to get profile!",
        "error"
      );
    }
  }
};

//get all playlist
export const getAllPlaylist = id => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Loading"
  });

  try {
    const response = await axios.get(`${baseUrl}/user/playlist/getAllPlaylist`);
    console.log("playlist response",response.data)

    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    dispatch({
      type: GET_ALL_PLAYLIST,
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    if (err.message === "Network Error") {
     // swal("Server is not responding", "Try again!", "error");
     dispatch({
      type: GET_ALL_PLAYLIST,
      payload: []
    });
    }
    if (err.response && err.response.data.msg.includes("not")) {
      dispatch({
        type: GET_ALL_PLAYLIST,
        payload: []
      });
      //swal("We have no playlist", "Try again!", "error");
    } else if (err.response) {
      if (err.response.status === 500) {
        swal("Something went wrong", "Fail to get record!", "error");
      } else {
        dispatch({
          type: GET_ALL_PLAYLIST,
          payload: []
        });
      }
    }
  }
};

//get all admin playlist
export const getAdminPlaylist = id => async dispatch => {
  console.log("this route in actoodd")
  dispatch({
    type: ADD_LOADER,
    payload: "admin Loading"
  });

  try {
    const response = await axios.get(
      `${baseUrl}/admin/playlist/getPlaylistByAdmin?adminID=${id}`
    );

    dispatch({
      type: REMOVE_LOADER,
      payload: "admin Loading"
    });

    dispatch({
      type: GET_ALL_PLAYLIST_ADMIN,
      payload: response.data.playlistResponse
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "admin Loading"
    });

    if (err.message === "Network Error") {
      swal(
        "Server is not responding Fail to get admin playlist",
        "Try again!",
        "error"
      );
    } else if (err.response) {
      if (err.response && err.response.data.msg.includes("not")) {
      
        swal("This admin has no playlist yet" , "Thanks!", "success");
      }
      if (err.response.status === 500) {
        swal("Something went wrong", "Fail to get record!", "error");
      } else {
        dispatch({
          type: GET_ALL_PLAYLIST_ADMIN,
          payload: []
        });
      }
    }
  }
};

//get all admin playlist
export const getSongInPlaylist = id => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "song Loading"
  });

  try {
    const response = await axios.get(
      `${baseUrl}/admin/playlist/getSonginPlaylist?playlistID=${id}`
    );
    console.log("response.data.songResponse", response.data.songResponse);

    dispatch({
      type: REMOVE_LOADER,
      payload: "song Loading"
    });

    dispatch({
      type: GET_ALL_ADMIN_SONG,
      payload: response.data.songResponse
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "song Loading"
    });

    if (err.message === "Network Error") {
      swal("Fail to get song in playlist,server issue", "Try again!", "error");
    } else if (err.response) {
      if (err.response.status === 500) {
        swal(
          "Something went wrong to get song",
          "Fail to get record!",
          "error"
        );
      } else {
        dispatch({
          type: GET_ALL_ADMIN_SONG,
          payload: []
        });
      }
    }
  }
};

//get all admin playlist
export const getPlaylistBySngleAdmin = id => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Loading"
  });

  try {
    const response = await axios.get(
      `${baseUrl}/admin/playlist/getPlaylistByID?playlistID=${id}`
    );

    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    dispatch({
      type: GET_ADMIN_PLAYLIST,
      payload: response.data.playlistResponse[0]
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    if (err.message === "Network Error") {
      swal("Fail to get admin playlist,Server issue", "Try again!", "error");
    } else if (err.response) {
      if (err.response && err.response.data.msg.includes("not")) {
        swal("Currently no song in this playlist", "Try again!", "error");
        dispatch({
          type: GET_ADMIN_PLAYLIST,
          payload: []
        });
      }
      if (err.response.status === 500) {
        swal("Something went wrong", "Fail to get record!", "error");
      } else {
        // dispatch({
        //   type: GET_ADMIN_PLAYLIST,
        //   payload: []
        // });
      }
    }
  }
};

//get all admin playlist
export const getPlaylistById = id => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Loading"
  });

  try {
    const response = await axios.get(
      `${baseUrl}/admin/playlist/getPlaylistByID?playlistID=${id}`
    );

    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    dispatch({
      type: GET_SPECIFIC_PLAYLIST,
      payload: response.data.playlistResponse[0]
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    if (err.message === "Network Error") {
      swal("Fail to get playlist ", "Try again!", "error");
    } else if (err.response) {
      if (err.response && err.response.data.msg.includes("not")) {
        swal("Currently no song in this playlist", "Try again!", "error");
        dispatch({
          type: GET_SPECIFIC_PLAYLIST,
          payload: []
        });
      }
      if (err.response.status === 500) {
        swal("Something went wrong", "Fail to get record!", "error");
      } else {
        dispatch({
          type: GET_SPECIFIC_PLAYLIST,
          payload: []
        });
      }
    }
  }
};

//get all admin playlist
export const favortPlaylist = (id, userId) => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Fav Loading"
  });

  try {
    const response = await axios.post(
      `${baseUrl}/user/playlist/addPlaylistToFavourite`,
      { playlistID: id, userID: userId }
    );

    dispatch({
      type: REMOVE_LOADER,
      payload: "Fav Loading"
    });
    dispatch({
      type: NOTIFICATION,
      payload: true
    });

    dispatch({
      type: FAVORITE_PLAYLIST,
      payload: response.data.msg
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Fav Loading"
    });

    if (err.message === "Network Error") {
      swal("Server is not responding", "Try again!", "error");
    } else if (err.response) {
      if (err.response && err.response.data.msg.includes("not")) {
        swal("Currently no song in this playlist", "Try again!", "error");
      }
      if (err.response && err.response.data.msg.includes("Already")) {
        swal("This playlist already in your favorite list");
      }
      if (err.response.status === 500) {
        swal("Something went wrong", "Fail to get record!", "error");
      }
    }
  }
};

//get all admin playlist
export const getFavPlaylist = id => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Loading"
  });

  try {
    const response = await axios.get(
      `${baseUrl}/user/playlist/getFavouritePlaylistsByID?playlistID=${id}`
    );

    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    dispatch({
      type: GET_FAV_PLAYLIST,
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    if (err.message === "Network Error") {
      swal("Server is not responding", "Try again!", "error");
    } else if (err.response) {
      // if (err.response.status === 400) {
      //   swal("Currently no fav playlist", "Fail to get record!", "error");
      // }
      if (err.response.status === 500) {
        swal("Something went wrong", "Fail to get record!", "error");
      } else {
        dispatch({
          type: GET_FAV_PLAYLIST,
          payload: []
        });
      }
    }
  }
};

//get all admin playlist
export const followPlaylist = (onwer, userId) => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Follow Loading"
  });

  try {
    const response = await axios.post(`${baseUrl}/user/api/followAdmin`, {
      adminID: onwer,
      userID: userId
    });

    dispatch({
      type: REMOVE_LOADER,
      payload: "Follow Loading"
    });
    dispatch({
      type: NOTIFICATION,
      payload: true
    });

    dispatch({
      type: FOLLOW_PLAYLIST,
      payload: response.data.msg
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Follow Loading"
    });

    if (err.message === "Network Error") {
      swal("Server is not responding", "Try again!", "error");
    } else if (err.response) {
      if (err.response && err.response.data.msg.includes("not")) {
        swal("Facing some problem", "Try again!", "error");
      }
      if (err.response && err.response.data.msg.includes("Already")) {
        swal("You already follow this admin");
      }
      if (err.response.status === 500) {
        swal("Something went wrong", "Fail to get record!", "error");
      }
    }
  }
};

//

//get all admin playlist
export const getFollowadmin = id => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Loading"
  });

  try {
    const response = await axios.get(
      `${baseUrl}/user/api/getFollowedAdminsByID?userID=${id}`
    );

    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    dispatch({
      type: GET_FOLLOW_ADMIN,
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    if (err.message === "Network Error") {
      swal("Server is not responding", "Try again!", "error");
    } else if (err.response) {
      // if (err.response && err.response.data.msg.includes("not")) {
      //   swal("Currently no song in this playlist yet", "Try again!", "error");

      // }
      if (err.response.status === 500) {
        swal("Something went wrong", "Fail to get record!", "error");
      } else {
        dispatch({
          type: GET_FOLLOW_ADMIN,
          payload: []
        });
      }
    }
  }
};

//get all admin playlist
export const editUser = (user, errorCallback) => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Loading"
  });

  try {
    const response = await axios.post(
      `${baseUrl}/admin/api/updateProfile`,
      user
    );

    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });
    dispatch({
      type: NOTIFICATION,
      payload: true
    });

    dispatch({
      type: EDIT_USER,
      payload: response.data.msg
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    if (err.message === "Network Error") {
      swal("Server is not responding", "Try again!", "error");
    } else if (err.response) {
      const errors = [];

      if (err.response && err.response.data.msg.includes("email")) {
        errors.push(["email", err.response.data.msg]);
      } else if (err.response && err.response.data.msg.includes("username")) {
        errors.push(["username", err.response.data.msg]);
      }
      errorCallback("formError", errors);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
  }
};

//get all admin playlist
export const getNotification = e => async dispatch => {
  try {
    const response = await axios.get(
      `${baseUrl}/admin/playlist/getLatestNotifications`
    );
    console.log("Notification response action",response.data)

    dispatch({
      type: GET_NOTIFICATION,
      payload: response.data
    });
  } catch (err) {
    if (err.message === "Network Error") {
      swal("Server is not responding", "Try again!", "error");
    } else if (err.response) {
      dispatch({
        type: GET_NOTIFICATION,
        payload: []
      });
    }
  }
};

//get all admin playlist
export const search = (keyword, errorCallback) => async dispatch => {
  dispatch({
    type: ADD_LOADER,
    payload: "Loading"
  });

  try {
    const response = await axios.get(
      `${baseUrl}/user/api/searchQuery/${keyword}`
    );

    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    dispatch({
      type: SEARCH,
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: REMOVE_LOADER,
      payload: "Loading"
    });

    if (err.message === "Network Error") {
      swal("Server is not responding", "Try again!", "error");
    }
  }
};

export const songCount = id => async dispatch => {
  console.log("iddd action",id)
  try {
    const response = await axios.post(
      `${baseUrl}/admin/uplaodSong/songCount/${id}`
    );
  } catch (err) {}
};

export const searchedSong = songArray => async dispatch => {
  
  dispatch({
    type: SEARCHED_SONG,
    payload: songArray
  });
};





export const getAdminBio = id => async dispatch => {
  
 

  try {
    const response = await axios.get(
      `${baseUrl}/admin/api/getAdminBio?userID=${id}`
    );

    console.log("ddcdd",response.data)
    dispatch({
      type: BIO,
      payload: response.data.msg
    });

   
  } catch (err) {
    

    if (err.message === "Network Error") {
     
    } else if (err.response) {
  

      // }
      if (err.response.status === 500) {
     
      } 
    }
  }
};