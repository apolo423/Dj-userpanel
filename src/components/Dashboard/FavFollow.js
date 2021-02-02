import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { connect } from "react-redux";
// import { allUser, deactiveUser,activeUser,setNotification } from '../../Redux/action/userAction'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Pagination from '../Paginator/Pagination'
import showAll from './showAll'
// import isEmpty from '../../Helpers/is-empty'
import 'react-toastify/dist/ReactToastify.min.css'

import 'react-notifications/lib/notifications.css';
import store from "../../../src/store";
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import Favorite from '../ChildComponent/Favorite'
import Following from '../ChildComponent/Following'
import swal from 'sweetalert';
class FavFollow extends Component {
 
  render() {
    
return (
        <div>
        <Header></Header>
          {/* following */}
          <section className="container-fluid">
            <div className="row my-5 pb-5">
              <div className="col-12">
                <div className="tabs">
                  <div className="tab-button-outer">
                    <ul id="tab-button">
                      <li><a href="#tab01">Favorites</a></li>
                      <li><a href="#tab02">Following</a></li>
                    </ul>
                  </div>
                  <div className="tab-select-outer">
                    <select id="tab-select">
                      <option value="#tab01">Favorites</option>
                      <option value="#tab02">Following</option>
                    </select>
            </div>
           
            <Favorite></Favorite>
            <Following></Following>
                  {/* tab2 */}
                  
                </div>
              </div>
            </div>
          </section>
          {/*end following */}
          {/* footer */}
          {/* <Footer></Footer> */}
        </div>
      );
    
  }
}


// const mapStateToProps = state => ({
//   getAllUser: state.userStore.getAllUser,
//   deactivedUser: state.userStore.deactivedUser,
//   activedUser: state.userStore.activedUser,
//   notfication: state.userStore.notfication,
// });
// export default connect(mapStateToProps, { allUser, deactiveUser, activeUser })(AllUser);

export default FavFollow

