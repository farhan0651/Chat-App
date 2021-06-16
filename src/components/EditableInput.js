/* eslint-disable arrow-body-style */
import React, { useCallback, useState } from 'react'
import {Input, InputGroup,Icon, Alert} from 'rsuite'

const EditableInput = ({initialVlue,onSave,label=null,placeholder='Write your nickname',emptyMsg="Input is empty",...inputProps}) => {
    
    const [input,setInput]=useState(initialVlue)

    const onIputChange=useCallback((value)=>{
        setInput(value);
    },[])

    const [isEditable,setIsEditable]=useState(false);

    const onEditClick=useCallback(()=>{
        setIsEditable((p)=>!p)
        setInput(initialVlue)
    },[initialVlue])

    const onSaveClick=async ()=>{
        const trimmed=input.trim();
        if(trimmed===''){
            Alert.info(emptyMsg,4000);
        }

        if(trimmed!==initialVlue){
           await onSave(trimmed);
        }

        setIsEditable(false);
    }
    
    return (
        <div>
            {label}
            <InputGroup>
            <Input 
            {...inputProps}
            disabled={!isEditable} 
            value={input} 
            placeholder={placeholder} 
            onChange={onIputChange} 
            />
            <InputGroup.Button onClick={onEditClick}>
            <Icon icon={isEditable ? 'close': 'edit2'} />
            </InputGroup.Button>
            {isEditable && (
                <InputGroup.Button onClick={onSaveClick}>
                <Icon icon='check' />
                </InputGroup.Button>
            )
            }
            </InputGroup>
        </div>
    )
}

export default EditableInput
