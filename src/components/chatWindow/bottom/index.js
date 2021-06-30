/* eslint-disable arrow-body-style */
import React, { useCallback, useState } from 'react'
import { InputGroup,Input,Icon, Alert } from 'rsuite'
import firebase from 'firebase/app'
import { useParams } from 'react-router'
import AttachmentBtnModal from './AttachmentBtnModal'
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
        createdAt:firebase.database.ServerValue.TIMESTAMP,
        likeCount:0
    }
}

const Bottom = () => {
    const [input,setInput]=useState('');
    const {profile}= useProfile()
    const {chatId}=useParams()
    const [isLoading,setIsLoading]=useState(false)

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

        setIsLoading(true)
        try {
            await database.ref().update(updates) 
            setInput('')
            setIsLoading(false)
            Alert.success("Message Sent Succesfully",4000)
        } catch (error) {
            setIsLoading(false)
            Alert.error(error.message,4000)
        }
    }

    const onKeyDown=(ev)=>{
        if(ev.keyCode===13){
            ev.preventDefault();
            onSendClick();
        }
    }

    const afterUpload=useCallback(async (files)=>{
        setIsLoading(true)
        const updates={}
        files.forEach(file=>{
            const msgData=assembledMessage(profile,chatId)
            msgData.file=file
            const messageId=database.ref('messages').push().key;
            updates[`/messages/${messageId}`]=msgData
        })
        const lastMsgId=Object.keys(updates).pop()
        updates[`/rooms/${chatId}/lastMessage`]={
            ...updates[lastMsgId],
            msgId:lastMsgId
        }
        try {
            await database.ref().update(updates) 
            setIsLoading(false)
            Alert.success("Message Sent Succesfully",4000)
        } catch (error) {
            setIsLoading(false)
            Alert.error(error.message,4000)
        }
    },[chatId,profile])

    return (
        <div>
            <InputGroup>
            <AttachmentBtnModal afterUpload={afterUpload} />
            <Input placeholder="Write your message here..." value={input} onChange={onInputChange} onKeyDown={onKeyDown} />
            <InputGroup.Button color='blue' appearance='primary' onClick={onSendClick} disabled={isLoading} >
            <Icon icon='send' />
            </InputGroup.Button>
            </InputGroup>
        </div>
    )
}

export default Bottom
