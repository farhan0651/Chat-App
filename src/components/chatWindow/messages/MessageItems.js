/* eslint-disable arrow-body-style */
import React from 'react'
import TimeAgo from 'timeago-react'
import { Button } from 'rsuite'
import ProfileInfoBtnModal from './ProfileInfoBtnModal'
import PresenceDot from '../../PresenceDot'
import ProfileAvatar from '../../Dashboard/ProfileAvatar'
import {useCurrentRoom} from '../../../context/currentRoomContext'
import { auth } from '../../../misc/firebase'

const MessageItems = ({message,handleAdmin}) => {

    const {author,createdAt,text}=message

    const isAdmin=useCurrentRoom(v=>v.isAdmin)
    const admins=useCurrentRoom(v=>v.admins)
    const isAuthor=auth.currentUser.uid===author.uid
    const isMsgAuthorAdmin=admins.includes(author.uid) 
    const canGrantAdmin= isAdmin && !isAuthor


    return (
        <li className='padded mb-1' >
            <div className='d-flex mb-1 align-items-center font-bolder'>
            <PresenceDot uid={author.uid} />
            <ProfileAvatar circle src={author.avatar} name={author.name} className='ml-1' size='md' />
            <ProfileInfoBtnModal profile={author} appearance='link' className='p-0 ml-1 text-black' >
            {canGrantAdmin &&
            <Button block color='blue' onClick={()=>handleAdmin(author.uid)} >
                {isMsgAuthorAdmin ? "Remove admin permision" : "Grant admin permission"}
            </Button>
            }
            </ProfileInfoBtnModal>
            <TimeAgo datetime={createdAt} className='font-normal text-black-45 ml-2' />
            </div>

            <div>
                <span className='word-bread-all'>{text}</span>
            </div>
        </li>
    )
}

export default MessageItems
