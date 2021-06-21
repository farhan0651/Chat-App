/* eslint-disable import/no-named-as-default */
/* eslint-disable arrow-body-style */
import React,{ useCallback } from 'react'
import { Button,Icon,Drawer, Alert } from 'rsuite'
import { useMediaQuery, useModalState } from '../../misc/customHooks'
import Dashboard from '.'
import {isOfflineForDatabase} from '../../context/ProfileContext'
import { auth, database } from '../../misc/firebase'

const DashboardToogle = () => {

    const {isOpen,open,close}=useModalState()
    const isMobile=useMediaQuery('(max-width: 992px)')

    const onSignOut=useCallback(
        () => {
          database.ref(`/status/${auth.currentUser.uid}`).set(isOfflineForDatabase).then(()=>{
          auth.signOut()
          Alert.info("Signed Out",4000);
          close();
        })
        .catch(error=>{
          Alert.error(error.message,4000)
        })
    },[close])

    return (
        <>
          <Button block color='blue' onClick={open} >
              <Icon icon='dashboard'/> Dashboard
          </Button>  
          <Drawer full={isMobile} show={isOpen} onHide={close} placement='left'>
            <Dashboard onSignOut={onSignOut} />
          </Drawer>
        </>
    )
}

export default DashboardToogle
