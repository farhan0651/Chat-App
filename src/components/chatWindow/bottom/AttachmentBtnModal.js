/* eslint-disable arrow-body-style */
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Icon, InputGroup,Modal,Button,Uploader, Alert } from 'rsuite'
import { useModalState } from '../../../misc/customHooks'
import { storage } from '../../../misc/firebase'

const maxFileSize=1000*1024*5

const AttachmentBtnModal = ({afterUpload}) => {
    const {chatId}=useParams()
    const {isOpen,open,close}=useModalState()
    const [fileList,setFileList]=useState([])
    const [isLoading,setIsLoading]=useState(false)

    const onChange=(fileArr)=>{
    const filtered=fileArr.filter(el=>el.blobFile.size <= maxFileSize).slice(0,5)
    setFileList(filtered)
    }

    const onUpload=async ()=>{
        setIsLoading(true)
        try {
            const uploadPromises=fileList.map(f=>{
               return storage.ref(`/chat/${chatId}`).child(Date.now()+f.name).put(f.blobFile,{cacheControl:`public,max-age=${3600*24*3}`})
            })
            const uploadSnapshots=await Promise.all(uploadPromises)

            const shapePromises=uploadSnapshots.map(async snap=>{
                return {
                contentType:snap.metadata.contentType,
                name: snap.metadata.name,
                url:await snap.ref.getDownloadURL()
            }
            })

                const files=await Promise.all(shapePromises)
                await afterUpload(files)
                setIsLoading(false)
                close()
            }
        catch (error) {
            setIsLoading(false)
            Alert.error(error.message,4000)
        }
    }

    return (
        <>
        <InputGroup.Button onClick={open} >
        <Icon icon='attachment' />
        </InputGroup.Button>
        <Modal show={isOpen} onHide={close} >
            <Modal.Header> 
            <Modal.Title>
                Select files for sending
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            onChange={onChange}
            multiple
            listType="picture-text"
            className='w-100'
            disabled={isLoading}
        />
            </Modal.Body>
            <Modal.Footer>
                <Button block disabled={isLoading} onClick={onUpload} >
                Send
                </Button>
                <div className='text-right mt-2'>
                    <small style={{color:'red'}} >
                        *Only files less than MB are allowed
                    </small>
                </div>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default AttachmentBtnModal
