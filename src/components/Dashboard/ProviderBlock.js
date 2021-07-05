/* eslint-disable arrow-body-style */
import React, { useState } from 'react'
import { Tag,Icon, Button, Alert } from 'rsuite';
import firebase from 'firebase/app';
import { auth } from '../../misc/firebase'

const ProviderBlock = () => {
    const [isConnected,setIsConnected]=useState({
        'google.com':auth.currentUser.providerData.some(data=> data.providerId === 'google.com'
        ),
        'facebook.com':auth.currentUser.providerData.some(data=> data.providerId === 'facebook.com'
        )
    })

    const updateIsConnected=(providerId,value)=>{
        setIsConnected(p=>{
            return{
                ...p,
                [providerId]:value  
            }
        }

        )
    }

    const unlink=async (providerId)=>{
        try {
            if(auth.currentUser.providerData.length===1){
                throw new Error(`You cannot disconnect from ${providerId}`)
            }
            await auth.currentUser.unlink(providerId)
            updateIsConnected(providerId,false)
        } catch (error) {
            Alert.error(error.message,4000)
        }
    }

    const unlinkFacebok=()=>{
        unlink('facebook.com');
    }
    const unlinkGoogle=()=>{
        unlink('google.com')
    }

    const link=async (provider)=>{
        try {
            await auth.currentUser.linkWithPopup(provider)
            Alert.success(`Linked to ${provider.providerId}`)
        } catch (error) {
            Alert.error(error.message,4000)
        }
    }

    const linkFacebok=()=>{
        link(new firebase.auth.FacebookAuthProvider())
    }
    const linkGoogle=()=>{
        link(new firebase.auth.GoogleAuthProvider())
    }
    return (
        <div>
            { isConnected['google.com'] && 
            (<Tag color='green' closable onClose={unlinkGoogle} >
                <Icon icon='google'/> Connected
            </Tag>)}
            { isConnected['facebook.com'] &&
            (<Tag color='blue' closable onClose={unlinkFacebok} >
                <Icon icon='facebook'/> Connected
            </Tag>)}
            <div className='mt-2'>
            { !isConnected['google.com'] &&
            (<Button color='green' block onClick={linkGoogle}>
            <Icon icon='google' />  Link to Google
            </Button>)}
            { !isConnected['facebook.com'] &&
            (<Button color='blue' block onClick={linkFacebok}>
               <Icon icon='facebook' /> Link to Facebook
            </Button>)}
            </div>
        </div>
    )
}

export default ProviderBlock
