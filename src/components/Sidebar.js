/* eslint-disable arrow-body-style */
import React, { useEffect, useRef, useState } from 'react'
import { Divider } from 'rsuite' 
import DashboardToogle from './Dashboard/DashboardToogle'
import CreateRoomModal from './Dashboard/CreateRoomModal'
import ChatRoomlist from './rooms/ChatRoomlist'

const Sidebar = () => {

    const [height,setHeight]=useState(0)
    const topRefSidebar=useRef()

    useEffect(()=>{
        if(topRefSidebar.current){
            setHeight(topRefSidebar.current.scrollHeight)
        }
    },[topRefSidebar])

    return (
        <div className="h-100 pt2">
            <div ref={topRefSidebar}>
                <DashboardToogle />
                <CreateRoomModal/>
                <Divider style={{ margin: 0, padding: '30px 0' }}>Join new room</Divider>
            </div>
            <ChatRoomlist aboveElementHeight={height} />
        </div>
    )
}

export default Sidebar
