/* eslint-disable arrow-body-style */
import React, { useRef, useState } from 'react'
import { Alert, Button, Modal } from 'rsuite'
import AvatarEditor from 'react-avatar-editor'
import {useModalState} from '../../misc/customHooks'
import { database, storage } from '../../misc/firebase'
import ProfileAvatar from './ProfileAvatar'
import { useProfile } from '../../context/ProfileContext';
import { getUserUpdates } from '../../misc/helpers'

const fileInputTypes=".png, .jpeg, .jpg"
const acceptedFileTypes=['image/png','image/jpeg','image/pjpeg']
const isValid=(file)=>acceptedFileTypes.includes(file.type);

const AvatarUploadBtn = () => {
    // eslint-disable-next-line no-unused-vars
    const [img,setImg]=useState(null)
    const {isOpen,open,close}=useModalState();
    const avatarReference=useRef()
    const {profile}=useProfile()
    const [isLoading,setIsLoading]=useState(false);
 
    const onFileInputChange=(eventObject)=>{
        const currentFile=eventObject.target.files;
        if(currentFile.length===1)
        {
            const file=currentFile[0];
            if(isValid(file)){
                setImg(file)
                open()
            }
            else{
                Alert.warning(`Wrong file type ${file.type}`,4000)
            }
        }
    }

    const getBlob=(canvas)=>{
        return new Promise((resolve,reject)=>{
            canvas.toBlob(blob=>{
                if(blob){
                    resolve(blob)
                }
                else{
                    reject(new Error('Processing Error'))
                }
            })
        })
    }

    const onUploadClick=async ()=>{
        setIsLoading(true)
        const canvas=avatarReference.current.getImageScaledToCanvas();
        try {
            const blobedData=await getBlob(canvas)
            const avtarFileReference=storage.ref(`/profiles/${profile.uid}`).child('avatar')
            const uploadAvatarResult=await avtarFileReference.put(blobedData,
            {cacheControl:`public,max-age=${3600*24*3}`})
                 
            const downloadURL=await uploadAvatarResult.ref.getDownloadURL()
            // const userAvatarRef=database.ref(`/profiles/${profile.uid}`).child('avatar')
            // userAvatarRef.set(downloadURL)
            const updates=await getUserUpdates(profile.uid,'avatar',downloadURL,database)
            database.ref().update(updates)
            setIsLoading(false)
            Alert.info("Avtar has been uploaded",4000)
            } 
       
            catch (er) {
            setIsLoading(false)
            Alert.error(`err.mesage,4000`)
        }
    }

    return (
        <div className='mt-3 text-center'>
            <ProfileAvatar circle src={profile.avatar} name={profile.name} className='width-200 height-200 img-fullsize font-huge' />
            <label htmlFor='Avatar' className='d-block cursor-pointer padded'>
                Select Avatar
                <input id='Avatar' type='file' className='d-none' accept={fileInputTypes} onChange={onFileInputChange} />
            </label>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                <Modal.Title>
                Adjust and upload your Avatar
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className='d-flex justify-content-center align-items-center h-100'>
                {img &&
                <AvatarEditor
                ref={avatarReference}
                image={img}
                width={200}
                height={200}
                border={1}
                borderRadius={100}
                />
                }
                </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance='ghost' block onClick={onUploadClick} disabled={isLoading} >
                        Upload Avatar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AvatarUploadBtn
