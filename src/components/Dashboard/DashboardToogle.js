/* eslint-disable arrow-body-style */
import React from 'react'
import { Button,Icon,Drawer } from 'rsuite'
import { useMediaQuery, useModalState } from '../../misc/customHooks'
import Dashboard from '.'

const DashboardToogle = () => {

    const {isOpen,open,close}=useModalState()
    const isMobile=useMediaQuery

    return (
        <>
          <Button block color='blue' onClick={open} >
              <Icon icon='dashboard'/> Dashboard
          </Button>  
          <Drawer full={isMobile} show={isOpen} onHide={close} placement='left'>
            <Dashboard />
          </Drawer>
        </>
    )
}

export default DashboardToogle
