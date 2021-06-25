/* eslint-disable arrow-body-style */
import React, { useState,useEffect,useCallback } from 'react'
import { useParams } from 'react-router'
import { Alert } from 'rsuite'
import MessageItems from './MessageItems'
import { database } from '../../../misc/firebase'
import {tranformToArrayWithId} from '../../../misc/helpers'

const Messages = () => {
    const {chatId}=useParams()
    const [messages,setMessage]=useState(null)
    console.log(messages)
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

    let alertMsg;

    const handleAdmin=useCallback(async (uid)=>{
        const adminRef=database.ref(`/rooms/${chatId}/admins`)
        await adminRef.transaction(admins=>{
            if(admins){
                if(admins[uid]){
                    admins[uid]=null
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    alertMsg="Admin permision removed"
                }
                else{
                    admins[uid]=true
                    alertMsg='Admin permision added'
                }
            }
            return admins
        })
        Alert.info(alertMsg,4000)
    },[chatId])

    return (
        <ul className='msg-list custom-scroll'>
            {chatIsEmpty && <li>No messages yet</li>}
            {canShowMessages && messages.map(msg=><MessageItems key={msg.id} message={msg} handleAdmin={handleAdmin} />)}
        </ul>
    )
}

export default Messages
