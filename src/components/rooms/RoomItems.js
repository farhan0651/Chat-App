/* eslint-disable arrow-body-style */
import React from 'react'
import TimeAgo from 'timeago-react'
import ProfileAvatar from '../Dashboard/ProfileAvatar'

const RoomItems = ({Currentroom}) => {

    const {name,createdAt,lastMessage}=Currentroom

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center '>
                <h3 className='text-disappear'>{name}</h3>
                <TimeAgo datetime={lastMessage ? new Date(lastMessage.createdAt) : new Date(createdAt)} className='font-normal text-black-45' />
            </div>

            <div className='d-flex align-items-center text-black-70'>
                { lastMessage ?
                    <>
                    <div className='d-flex align-items-center'>
                    <ProfileAvatar circle name={lastMessage.author.name} src={lastMessage.author.avatar} size='md' />
                    </div>
                    <div className='text-disappear ml-2'>
                    <div className='italic'>{lastMessage.author.name}</div>
                    <span>{lastMessage.text || lastMessage.file.name}</span>
                    </div>
                    </>
                    :
                    <span>No message yet...</span>
                }
            </div>
        </div>
    )
}

export default RoomItems
