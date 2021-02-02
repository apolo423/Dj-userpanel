import axios from 'axios'

const setAuthToken = token => {
    if (token) {
        //Attach token to every request
        axios.defaults.headers.common['authorization'] = token;
    }
    else {
        //Delete the Authorization
        delete axios.defaults.headers.common['authorization'];
    }
}
export default setAuthToken;