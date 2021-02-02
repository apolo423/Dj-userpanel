import React, { Component } from 'react'
import { Link} from "react-router-dom";
 class ErrorNotFound extends Component {
  render() {
    return (
      <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <div></div>
          <h1>404</h1>
        </div>
        <h2>Page not found</h2>
        <p>{this.props.data} unavailable.</p>
        <Link to="/">home page</Link>
      </div>
    </div>
    )
  }
}
ErrorNotFound.defaultProps = {
  data : "Search"
}
export default ErrorNotFound;