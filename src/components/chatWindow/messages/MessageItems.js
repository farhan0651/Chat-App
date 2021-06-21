/* eslint-disable arrow-body-style */
import React from 'react'
import TimeAgo from 'timeago-react'
import ProfileInfoBtnModal from './ProfileInfoBtnModal'
import ProfileAvatar from '../../Dashboard/ProfileAvatar'

const MessageItems = ({message}) => {

    const {author,createdAt,text}=message

    return (
        <li className='padded mb-1' >
            <div className='d-flex mb-1 align-items-center font-bolder'>
            <ProfileAvatar circle src={author.avatar} name={author.name} className='ml-1' size='md' />
            <ProfileInfoBtnModal profile={author} appearance='link' className='p-0 ml-1 text-black' />
            <TimeAgo datetime={createdAt} className='font-normal text-black-45 ml-2' />
            </div>

            <div>
                <span className='word-bread-all'>{text}</span>
            </div>
        </li>
    )
}

export default MessageItems
