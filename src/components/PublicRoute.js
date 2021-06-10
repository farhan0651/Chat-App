/* eslint-disable arrow-body-style */
import React from 'react'
import { Redirect,Route} from 'react-router';
import { Container, Loader } from 'rsuite';
import { useProfile } from '../context/ProfileContext';

const PublicRoute = ({children, ...routeProps}) => {

    const {Profile,isLoading}=useProfile();

    if(isLoading && !Profile){
        return <Container>
            <Loader center vertical size="md" content="Loading" speed="slow" />
        </Container>
    }

    if(Profile && !isLoading){
        return <Redirect to="/" />
    }

    return (
        <Route {...routeProps}>
            {children}
        </Route>
    )
}

export default PublicRoute
