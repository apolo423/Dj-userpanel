import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Auth/Login";
import ForgetPassword from "./components/Auth/ForgetPassword";
import ChangePassword from "./components/Auth/ChangePassword";
import ErrorNotFound from "./components/NotFound/ErrorNotFound";
import FavFollow from "./components/Dashboard/FavFollow";
import PLaylistDetail from "./components/Dashboard/PLaylistDetail";
import PLaylistDetailOld from "./components/Dashboard/PLaylistDetailOld";
import SearchSongPlayList from "./components/Dashboard/SearchSongPlayList";
import Profile from "./components/Dashboard/Profile";
import Dashboard from "./components/Dashboard/Dashboard";
import SignUp from "./components/Auth/SignUp";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";

import * as $ from "jquery";
import AuthRoute from "./helpers/AuthRoute";
import ProtectedRoute from "./helpers/ProtectedRoute";
import isEmpty from "./utils/is-empty";
import setAuthToken from "./utils/setAuthToken";
import ImageUplaod from "./components/Auth/ImageUplaod";
import AdminProfile from "./components/Dashboard/AdminProfile";

import AdminPanel from "./components/Admin/AdminPanel"
import jwt_decode from "jwt-decode";
import {
  setCurrentUser,
  logoutUser,
  getNotification,
} from "./services/auth/action";

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);

  const decoded = jwt_decode(localStorage.jwtToken);

  store.dispatch(setCurrentUser(decoded));

  setInterval(() => {
    const currentTime = Date.now() / 1000;
    if (
      decoded.exp < currentTime ||
      isEmpty(localStorage.getItem("jwtToken"))
    ) {
      store.dispatch(logoutUser());

      window.location = "/";
    }
  }, 60000);
}

// setInterval(() => {
//   console.log("i shouild call")
//   store.dispatch(getNotification());
// }, 5000);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Switch>
              <AuthRoute exact path="/" component={Login} />
              <ProtectedRoute exact path="/dashboard" component={Dashboard} />
              <AuthRoute exact path="/signup" component={SignUp} />
              <AuthRoute
                exact
                path="/forget-password"
                component={ForgetPassword}
              />
              <Route exact path="/change-password" component={ChangePassword} />

              <ProtectedRoute
                exact
                path="/favorite-follow"
                component={FavFollow}
              />
              <ProtectedRoute
                exact
                path="/admin-profile"
                component={AdminProfile}
              />

              <ProtectedRoute
                exact
                path="/playlist-detail"
                component={PLaylistDetail}
              />
              <ProtectedRoute
                exact
                path="/playlist-detail/old"
                component={PLaylistDetailOld}
              />
              <ProtectedRoute
                exact
                path="/search"
                component={SearchSongPlayList}
              />
              <ProtectedRoute exact path="/user-profile" component={Profile} />
              <ProtectedRoute exact path="/adminpanel" component={AdminPanel}/>
              <ProtectedRoute
                exact
                path="/notFound"
                component={ErrorNotFound}
              />

              <Route component={ErrorNotFound} />
            </Switch>

            {/*               
          <Footer/> */}
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
