/* eslint-disable arrow-body-style */
import React, { useState,useEffect } from 'react'
import { useParams } from 'react-router'
import MessageItems from './MessageItems'
import { database } from '../../../misc/firebase'
import {tranformToArrayWithId} from '../../../misc/helpers'

const Messages = () => {
    const {chatId}=useParams()
    const [messages,setMessage]=useState(null)
    const chatIsEmpty= messages && messages.length===0
    const canShowMessages= messages && messages.length>0

    useEffect(() => {
        const messageRef=database.ref('/messages')
        messageRef.orderByChild('roomId').equalTo(chatId).on('value',(snapshot)=>{
            const data=tranformToArrayWithId(snapshot.val())
            setMessage(data)
        })
        return () => {
            messageRef.off('value')
        }
    }, [chatId])

    return (
        <ul className='msg-list custom-scroll'>
            {chatIsEmpty && <li>No messages yet</li>}
            {canShowMessages && messages.map(msg=><MessageItems key={msg.id} message={msg}  />)}
        </ul>
    )
}

export default Messages
