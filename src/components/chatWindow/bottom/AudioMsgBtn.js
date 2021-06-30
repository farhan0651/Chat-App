/* eslint-disable arrow-body-style */
import React, { useCallback, useState } from 'react'
import { InputGroup,Icon, Alert } from 'rsuite'
import { ReactMic } from 'react-mic'
import { useParams } from 'react-router'
import { storage } from '../../../misc/firebase'

const AudioMsgBtn = ({afterUpload}) => {
    
    const {chatId}=useParams()
    const [isRecording,setIsRecording]=useState(false)
    const [isUploading,setIsUploading]=useState(false)

    const onClick=useCallback(()=>{
        setIsRecording(p=>!p)
    },[])

    const onUpload=useCallback(async(data)=>{
        setIsUploading(true)
        try {
        const snap=await storage.ref(`/chat/${chatId}`)
        .child(`audio_${Date.now().mp3}`)
        .put(data.blob,{cacheControl:`public,max-age=${3600*24*3}`})

        const file={
            contentType:snap.metadata.contentType,
            name: snap.metadata.name,
            url:await snap.ref.getDownloadURL()
        }
        setIsUploading(false)
        afterUpload([file])
        } 
        catch (error) {
            setIsUploading(false)
            Alert.error(error.message,4000)
        }
    },[afterUpload, chatId])

    return (
        <>
        <InputGroup.Button onClick={onClick} disabled={isUploading} className={isRecording ? 'animate-blink':''} >
        <Icon icon='microphone' />
        </InputGroup.Button>
        <ReactMic
        record={isRecording}
        className="d-none"
        onStop={onUpload}
        mmimeType="audio/mp3"
        />
        </>
    )
}

export default AudioMsgBtn
