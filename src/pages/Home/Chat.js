/* eslint-disable arrow-body-style */
import React from 'react'
import { useParams } from 'react-router'
import { Loader } from 'rsuite'
import { CurrentRoomProvider } from '../../context/currentRoomContext'
import ChatTop from '../../components/chatWindow/top'
import ChatMessages from '../../components/chatWindow/messages'
import ChatBottom from '../../components/chatWindow/bottom'
import {useRooms} from '../../context/roomsContext'

const Chat = () => {
    const {chatId}=useParams()
    const rooms=useRooms()

    if(!rooms){
        return <Loader center vertical content='Loading' size='md' speed='slow' />
    }

    const currentRoom=rooms.find(room=> room.id===chatId)

    if(!currentRoom){
       return <h6 className='text-center mt-page' >Chat room with {chatId} not found</h6>
    }

    const {name,description}=currentRoom

    const currentRoomData={
        name,description
    }

    return (
        <CurrentRoomProvider data={currentRoomData}>
            <div className='chat-top'>
            <ChatTop />
            </div>
            <div className='chat-middle'>
            <ChatMessages />
            </div>
            <div>
            <ChatBottom className='chat-bottom' />
            </div>
        </CurrentRoomProvider>
    )
}

export default Chat

