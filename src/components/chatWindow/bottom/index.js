/* eslint-disable arrow-body-style */
import React, { useCallback, useState } from 'react'
import { InputGroup,Input,Icon, Alert } from 'rsuite'
import firebase from 'firebase/app'
import { useParams } from 'react-router'
import {database} from '../../../misc/firebase'
import {useProfile} from '../../../context/ProfileContext'

function assembledMessage(profile,chatId){
    return{
        roomId:chatId,
        author:{
            name:profile.name,
            uid:profile.uid,
            createdAt:profile.createdAt,
            ...(profile.avatar ? {avatar:profile.avatar}: {})
        },
        createdAt:firebase.database.ServerValue.TIMESTAMP
    }
}

const Bottom = () => {
    const [input,setInput]=useState('');
    const {profile}= useProfile()
    const {chatId}=useParams()
    const [isLoading,seIsLoading]=useState(false)

    const onInputChange=useCallback((value)=>{
        setInput(value)
    },[])

    const onSendClick=async ()=>{
        if(input.trim()===''){
            return
        }
        const msgData=assembledMessage(profile,chatId)
        msgData.text=input
        const updates={}
        const messageId=database.ref('messages').push().key;
        updates[`/messages/${messageId}`]=msgData
        updates[`/rooms/${chatId}/lastMessage`]={
            ...msgData,
            msgId:messageId
        }

        seIsLoading(true)
        try {
            await database.ref().update(updates) 
            setInput('')
            seIsLoading(false)
            Alert.success("Message Sent Succesfully",4000)
        } catch (error) {
            seIsLoading(false)
            Alert.error(error.message,4000)
        }
    }

    const onKeyDown=(ev)=>{
        if(ev.keyCode===13){
            ev.preventDefault();
            onSendClick();
        }
    }

    return (
        <div>
            <InputGroup>
            <Input placeholder="Write your message here..." value={input} onChange={onInputChange} onKeyDown={onKeyDown} />
            <InputGroup.Button color='blue' appearance='primary' onClick={onSendClick} disabled={isLoading} >
            <Icon icon='send' />
            </InputGroup.Button>
            </InputGroup>
        </div>
    )
}

export default Bottom