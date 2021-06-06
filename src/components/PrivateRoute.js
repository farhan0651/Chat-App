/* eslint-disable arrow-body-style */
import React from 'react'
import { Redirect,Route} from 'react-router';

const PrivateRoute = ({children, ...routeProps}) => {

    const Profile=false;

    if(!Profile){
        return <Redirect to="/signin" />
    }

    return (
        <Route {...routeProps}>
            {children}
        </Route>
    )
}

export default PrivateRoute
