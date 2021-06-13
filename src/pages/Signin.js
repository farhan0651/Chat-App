/* eslint-disable arrow-body-style */
import React from 'react'
import { Container, Grid, Panel,Row,Col,Icon, Button, Alert } from 'rsuite'
import firebase from 'firebase/app'
import { auth, database } from '../misc/firebase'

const Signin = () => {

    const signInProvider=async (provider)=>{
        try {
            const {additionalUserInfo,user}= await auth.signInWithPopup(provider);
            if(additionalUserInfo.isNewUser){
               await database.ref(`/profiles/${user.uid}`).set({
                    name: user.displayName,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                })
            }
            Alert.success("Signed in",4000)
            
        } catch (error) {
            Alert.info(error.message,4000)
        }
    }

    const onFacebookSignIn=()=>{
        signInProvider(new firebase.auth.FacebookAuthProvider());
    }

    const onGoogleSignIn=()=>{
        signInProvider(new firebase.auth.GoogleAuthProvider());
    }


    return (
        <Container>
            <Grid className='mt-page'>
                <Row>
                    <Col >
                    <Panel xs={24} md={12} mdOffset={6}>
                        <div className='text-center'>
                        <h2>Welcome to Chat App</h2>
                        <p>Progressive chat platform for new developers
                        </p>
                        {console.log("Ye signin page hai")}
                        </div>
                        <div className='mt-3'>
                            <Button block  color='blue' onClick={onFacebookSignIn}>
                                 <Icon icon='facebook' />
                                   Continue with Facebok
                            </Button>
                           <Button block  color='green' onClick={onGoogleSignIn}>
                                 <Icon icon='google' />
                                   Continue with google
                            </Button>
                        </div>
                    </Panel>
                    </Col>
                </Row>
            </Grid>
        </Container>
    )
}

export default Signin
