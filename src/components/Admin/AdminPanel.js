import React, { Component } from "react";
import { connect } from "react-redux";

class AdminPanel extends Component{

    componentDidMount(){
        console.log(this.props.auth)
        if(!this.props.auth.isAuthenticated){
            this.props.history.push("/");
        }else if(this.props.auth.user.role == 'user'){
//            this.props.history.push("/");
        }

    }

    render(){
        return(
            <div>
                <div className="row">

                </div>
            </div>
        )
    }
}
const mapStateToProps = state =>({
    auth:state.authReducer
});
export default connect(mapStateToProps)(AdminPanel)