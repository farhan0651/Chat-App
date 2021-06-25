/* eslint-disable arrow-body-style */
import React, { useState,useEffect,useCallback } from 'react'
import { useParams } from 'react-router'
import { Alert } from 'rsuite'
import MessageItems from './MessageItems'
import { auth, database } from '../../../misc/firebase'
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

    const handleLike=useCallback(async(msgId)=>{

        const {uid}=auth.currentUser
        const msgRef=database.ref(`/messages/${msgId}`)
        await msgRef.transaction(msg=>{
            if(msg){
                if(msg.likes && msg.likes[uid] ){
                    msg.likeCount-=1
                    msg.likes[uid]=null
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    alertMsg="Liked removed"
                }
                else{
                    msg.likeCount+=1
                    if(!msg.likes){
                        msg.likes={}
                    }
                    msg.likes[uid]=true
                    alertMsg='Like added'
                }
            }
            return msg
        })
        Alert.info(alertMsg,4000)
    },[])

    return (
        <ul className='msg-list custom-scroll'>
            {chatIsEmpty && <li>No messages yet</li>}
            {canShowMessages && messages.map(msg=><MessageItems key={msg.id} message={msg} handleAdmin={handleAdmin} handleLike={handleLike} />)}
        </ul>
    )
}

export default Messages
