import { combineReducers } from 'redux';
import { authReducer } from './auth/reducer';
import { routerReducer } from "react-router-redux";



const reducer = combineReducers({
    routing: routerReducer,
    authReducer
})

export default reducer;

