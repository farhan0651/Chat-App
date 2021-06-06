/* eslint-disable arrow-body-style */
import React, { Children } from 'react'
import { Redirect,Route} from 'react-router';

const PrivateRoute = ({chldren, ...routeProps}) => {

    const Profile=false;

    if(!Profile){
        return <Redirect to="/signin" />
    }

    return (
        <Route {...routeProps}>
            {Children}
        </Route>
    )
}

export default PrivateRoute
