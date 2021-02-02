import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { getAllAdmin, getAllPlaylist } from "../../services/auth/action";
import { connect } from "react-redux";
class ShowTopAdmin extends Component {
  async componentDidMount() {
    await this.props.getAllPlaylist();
  }
  render() {

    return (
      <OwlCarousel className="owl-theme" margin={10} nav>
        {this.props.data.map(item => (
          <Link style={{ textDecoration: 'none'}} to={`/admin-profile?admin=${item.id}`}>
            <div className="item">
              <div className="card dj-card">
                <img
                  className="card-img-top"
                  src={item.imageUrl}
                  alt="Card image cap"
                />
                <div className="card-body dj-card-body">
                  <h3>
                    <a>{item.name}</a>
                  </h3>
                 
                </div>
              </div>
            </div>
          </Link>
        ))}
      </OwlCarousel>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.authReducer
});
export default connect(mapStateToProps, { getAllPlaylist })(ShowTopAdmin);
