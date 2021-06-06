/* eslint-disable arrow-body-style */
import React from 'react'
import { Redirect,Route} from 'react-router';

const PublicRoute = ({children, ...routeProps}) => {

    const Profile=false;

    if(Profile){
        return <Redirect to="/" />
    }

    return (
        <Route {...routeProps}>
            {children}
        </Route>
    )
}

export default PublicRoute
