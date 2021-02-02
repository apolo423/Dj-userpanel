import {
  ADD_LOADER,
  NOTIFICATION,
  FAVORITE_PLAYLIST,
  GET_SPECIFIC_PLAYLIST,
  GET_ADMIN_PLAYLIST,
  GET_ALL_ADMIN_SONG,
  GET_ALL_PLAYLIST_ADMIN,
  GET_ALL_ADMIN,
  GET_ALL_PLAYLIST,
  USER_PROFILE,
  GET_FAV_PLAYLIST,
  FOLLOW_PLAYLIST,
  SONG_RUN,
  EDIT_USER,
  SEARCHED_SONG,
  GET_NOTIFICATION,
  SEARCH,
  SONGPATH,
  REMOVE_LOADER,
  UPDATE_PASSWORD,
  BIO,
  FORGET_PASSWORD,
  SET_CURRENT_USER,
  REGISTER_USER,
  GET_FOLLOW_ADMIN
} from "./type";
import isEmpty from "../../utils/is-empty";

const initialState = {
  isAuthenticated: false,
  user: {},
  newUser: {},
  forgotPassword: {},
  waitingFor: [],
  userRegister: "",
  updatePassword: "",
  forgetPassword: "",
  allAdminList: [],
  playlistList: [],
  playlistRecord: {},
  notfication: Boolean,
  userProfile: {},
  songInPlaylist: [],
  SEARCH: [],
  playlist: {},
  favMessage: "",
  followMessage: "",
  adminPlaylist: [],
  favPlaylist: [],
  followPlaylist: [],
  notificationList: [],
  searchedSong: [],
  editMessage: "",
  songPath: "",
    searchedSong:[],
  songRunValue: "",
  bio:""
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LOADER:
      return {
        ...state,
        waitingFor: [...state.waitingFor, action.payload]
          };
      case SONG_RUN:
            return {
                ...state,
                songRunValue: action.payload
              };
    case GET_NOTIFICATION:
      return {
        ...state,
        notificationList: action.payload
      };
    case SEARCHED_SONG:
      console.log("inreducver",action.payload)
      return {
        ...state,
        searchedSong:action.payload
      }
    case BIO:
        return {
          ...state,
          bio: action.payload
        };

    case SONGPATH:
      return {
        ...state,
        songPath: action.payload
      };

    case SEARCH:
      return {
        ...state,
        searchedSong: action.payload
      };
    case EDIT_USER:
      return {
        ...state,
        editMessage: action.payload
      };
    case GET_FOLLOW_ADMIN:
      return {
        ...state,
        followPlaylist: action.payload
      };
    case GET_FAV_PLAYLIST: {
      return {
        ...state,
        favPlaylist: action.payload
      };
    }
    case NOTIFICATION:
      return {
        ...state,
        notfication: action.payload
      };

    case FAVORITE_PLAYLIST:
      return {
        ...state,
        favMessage: action.payload
      };
    case FOLLOW_PLAYLIST:
      return {
        ...state,
        followMessage: action.payload
      };
    case GET_SPECIFIC_PLAYLIST:
      return {
        ...state,
        playlistRecord: action.payload
      };
    case GET_ADMIN_PLAYLIST: {
      return {
        ...state,
        playlist: action.payload
      };
    }
    case GET_ALL_PLAYLIST_ADMIN:
      return {
        ...state,
        adminPlaylist: action.payload
      };
    case GET_ALL_ADMIN_SONG:
      return {
        ...state,
        songInPlaylist: action.payload
      };

    case USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload
      };
    case FORGET_PASSWORD:
      return {
        ...state,
        forgetPassword: action.payload
      };

    case UPDATE_PASSWORD:
      return {
        ...state,
        updatePassword: action.payload
      };
    case REMOVE_LOADER:
      return {
        ...state,
        waitingFor: state.waitingFor.filter(l => l !== action.payload)
      };
    case NOTIFICATION:
      return {
        ...state,
        notfication: action.payload
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case REGISTER_USER:
      return {
        ...state,
        userRegister: action.payload
      };

    case GET_ALL_ADMIN:
      return {
        ...state,
        allAdminList: action.payload
      };
    case GET_ALL_PLAYLIST:
      return {
        ...state,
        playlistList: action.payload
      };

    default:
      return state;
  }
};
