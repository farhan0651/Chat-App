/* eslint-disable arrow-body-style */
import React, { useCallback, useRef, useState } from 'react'
import { Button, Icon, Modal,Form, FormGroup,FormControl,ControlLabel, Schema, Alert } from 'rsuite'
import firebase from 'firebase/app'
import {auth, database} from '../../misc/firebase'
import { useModalState } from '../../misc/customHooks'

const {StringType}=Schema.Types
const model=Schema.Model({
    name:StringType().isRequired("Chat room name is required"),
    description:StringType().isRequired("Chat room description is required")
})

const InitialForm={
    name:"",
    description:""
}

const CreateRoomModal = () => {

    const {isOpen,open,close}=useModalState()
    const [formValue,setFormValue]=useState(InitialForm)
    const [isLoading,setIsLoading]=useState(false)
    const formReference=useRef()

    const onFormChange=useCallback((value)=>{
        setFormValue(value);
    },[])

    const onSubmit=async ()=>{
        if(!formReference.current.check()){
            return;
        }
        setIsLoading(true)
        const newRoomData={
            ...formValue,
            createdAt:firebase.database.ServerValue.TIMESTAMP,
            admins:{
            [auth.currentUser.uid]:true
            }
        }

        try {
            await database.ref('rooms').push(newRoomData)
            setIsLoading(false)
            Alert.info(`Chat room ${formValue.name} has been created`,4000)
            setFormValue(InitialForm)
            close()
        } catch (error) {
            setIsLoading(false)
            Alert.error(error.message,4000)
        }
    }

    return (
        <div className='mt-1'>
            <Button block color='green' onClick={open}>
            <Icon icon='creative' /> Create new chat room
            </Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                <Modal.Title>New Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid onChange={onFormChange} formValue={formValue} model={model} ref={formReference} >
                        <FormGroup>
                            <ControlLabel>Room Name</ControlLabel>
                            <FormControl name='name' placeholder="Enter chat room name" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Description</ControlLabel>
                            <FormControl  componentClass="textarea" name='description' rows={5} placeholder="Enter room description..." />
                        </FormGroup>
                    </Form>
                    </Modal.Body>
                <Modal.Footer>
                    <Button block appearance='primary' onClick={onSubmit} disabled={isLoading} >
                        Create New Chat Room
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateRoomModal
