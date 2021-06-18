/* eslint-disable arrow-body-style */
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Nav,Loader } from 'rsuite'
import { useRooms } from '../../context/roomsContext'
import RoomItems from './RoomItems'

const ChatRoomlist = ({aboveElementHeight}) => {

    const rooms=useRooms();
    const location=useLocation();

    return (
        <Nav appearance='subtle' vertical reversed className='overflow-y-scroll custom-scroll' activeKey={location.pathname}
        style={{
            height: `calc(100% - ${aboveElementHeight}px)`
        }}
        >
            {!rooms && <Loader center vertical content='Loading' speed='slow' size='md' />}
            {rooms && rooms.length>0 && rooms.map(room=>(
                <Nav.Item key={room.id} componentClass={Link} to={`/chat/${room.id}`} eventKey={`/chat/${room.id}`} >
                <RoomItems Currentroom={room} />  
                </Nav.Item>
            
            ))}
            
        </Nav>
    )
}

export default ChatRoomlist
