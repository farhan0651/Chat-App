/* eslint-disable arrow-body-style */
import React, { useState,useEffect,useCallback, useRef } from 'react'
import { useParams } from 'react-router'
import { Alert,Button } from 'rsuite'
import MessageItems from './MessageItems'
import { auth, database, storage } from '../../../misc/firebase'
import {groupBy, tranformToArrayWithId} from '../../../misc/helpers'

const pageSize=15

const messageRef=database.ref('/messages')

function shouldScrollToBottom(node,threshold=30){
    const percentage=(100*node.scrollTop)/(node.scrollHeight-node.clientHeight) || 0   
    return percentage>=threshold 
}

const Messages = () => {
    const {chatId}=useParams()
    const [messages,setMessage]=useState(null)
    const [limit,setLimit]=useState(pageSize)
    const chatIsEmpty= messages && messages.length===0
    const canShowMessages= messages && messages.length>0
    const selfRef=useRef()

    const loadMessages=useCallback((limitToLast)=>{
        const node=selfRef.current
        messageRef.off()
        messageRef
        .orderByChild('roomId')
        .equalTo(chatId)
        .limitToLast(limitToLast || pageSize)
        .on('value',(snapshot)=>{
            const data=tranformToArrayWithId(snapshot.val())
            setMessage(data)
            if(shouldScrollToBottom(node)){
                node.scrollTop=node.scrollHeight
            }
        })
        setLimit(p=>p+pageSize)
    },[chatId])

    const onLoadMore=useCallback(()=>{
        const node=selfRef.current
        const oldHeight=node.scrollHeight
        loadMessages(limit)
        setTimeout(()=>{
        const newHeight=node.scrollHeight
        node.scrollTop=newHeight-oldHeight
        },500)  
    },[loadMessages,limit])

    useEffect(() => {
        const node=selfRef.current
        loadMessages()
        setTimeout(()=>{
        node.scrollTop=node.scrollHeight
        },500)
        return () => {
            messageRef.off('value')
        }
    }, [loadMessages])

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

    const handleDelete=useCallback(async (msgId,file)=>{
        // eslint-disable-next-line no-alert
        if(!window.confirm('Delete this message?')){
            return
        }
        const isLast=messages[messages.length - 1].id===msgId
        const updates={}
        updates[`/messages/${msgId}`]=null
        if(isLast && messages.length > 1){
             updates[`/rooms/${chatId}/lastMessage`]={
                ...messages[messages.length - 2],
                msgId: messages[messages.length - 2].id
            }
        }
        if(isLast && messages.length===1){
            updates[`/rooms/${chatId}/lastMessage`]=null
        }

        try {
            await database.ref().update(updates)
            Alert.info("Message Deleted")
        } catch (error) {
            // eslint-disable-next-line consistent-return
            return Alert.error(error.message,4000)
        }

        if(file){
        try {
        const fileRef=storage.refFromURL(file.url)
        fileRef.delete()      
        } catch (error) {
            Alert.error(error.message,4000)
        }
    }

    },[chatId,messages])

    const renderMessages=()=>{
        const groups=groupBy(messages,(item)=>new Date(item.createdAt).toDateString())

        const items=[]
        Object.keys(groups).forEach((date)=>{
            items.push(<li className='text-center mb-1 padded' >{date}</li>)
            const msgs=groups[date].map(msg=>(
            <MessageItems key={msg.id} message={msg} 
            handleAdmin={handleAdmin} handleLike={handleLike} 
            handleDelete={handleDelete} />
            ))
            items.push(...msgs)
        })
        return items
    }

    return (
        <ul ref={selfRef} className='msg-list custom-scroll'>
            {messages && messages.length>=pageSize && 
             (<li className='text-center mt-2 mb-2'><Button onClick={onLoadMore} color='green' >
                 Load more
                 </Button></li>)
            }
            {chatIsEmpty && <li>No messages yet</li>}
            {canShowMessages && renderMessages() }
        </ul>
    )
}

export default Messages
