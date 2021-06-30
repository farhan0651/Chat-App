/* eslint-disable arrow-body-style */
import React from 'react'
import TimeAgo from 'timeago-react'
import { Button } from 'rsuite'
import IconBtnControl from './IconBtnControl'
import ProfileInfoBtnModal from './ProfileInfoBtnModal'
import PresenceDot from '../../PresenceDot'
import ProfileAvatar from '../../Dashboard/ProfileAvatar'
import ImageBtnModal from './ImageBtnModal'
import { useCurrentRoom } from '../../../context/currentRoomContext'
import { auth } from '../../../misc/firebase'
import { useHover, useMediaQuery } from '../../../misc/customHooks'

const renderFileMessage=(file)=>{
    if(file.contentType.includes('image')){
        return <div className='height-220'>
            <ImageBtnModal src={file.url} fileName={file.name} />
        </div>
    }

    return <a href={file.url}>Download {file.name}</a>
}

const MessageItems = ({ message, handleAdmin,handleLike,handleDelete }) => {

    const { author, createdAt, text,file,likeCount,likes } = message

    const isAdmin = useCurrentRoom(v => v.isAdmin)
    const admins = useCurrentRoom(v => v.admins)
    const isAuthor = auth.currentUser.uid === author.uid
    const isMsgAuthorAdmin = admins.includes(author.uid)
    const canGrantAdmin = isAdmin && !isAuthor

    const isMobile=useMediaQuery('(max-width: 992px)')
    const [selfRef,isHovered]=useHover()
    const isLiked= likes && Object.keys(likes).includes(auth.currentUser.uid)
    const canShowIcons= isMobile || isHovered



    return (
        <li className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02': ''}`} ref={selfRef} >
            <div className='d-flex mb-1 align-items-center font-bolder'>
                <PresenceDot uid={author.uid} />
                <ProfileAvatar circle src={author.avatar} name={author.name} className='ml-1' size='md' />
                <ProfileInfoBtnModal profile={author} appearance='link' className='p-0 ml-1 text-black' >
                    {canGrantAdmin &&
                        <Button block color='blue' onClick={() => handleAdmin(author.uid)} >
                            {isMsgAuthorAdmin ? "Remove admin permision" : "Grant admin permission"}
                        </Button>
                    }
                </ProfileInfoBtnModal>
                <TimeAgo datetime={createdAt} className='font-normal text-black-45 ml-2' />
                <IconBtnControl
                    {...(isLiked ? {color:'red'}:{})}
                    isVisible={canShowIcons}
                    iconName='heart'
                    tooltip='Like this message'
                    onClick={()=>handleLike(message.id)}
                    badgeContent={likeCount}

                />
                {isAuthor && (
                <IconBtnControl
                    isVisible={canShowIcons}
                    iconName='close'
                    tooltip='Delete this message'
                    onClick={()=>handleDelete(message.id)}
    
                    />
                )}
            </div>

            <div>
            {text && <span className='word-bread-all'>{text}</span>}
            {file && renderFileMessage(file)}
            </div>
        </li>
    )
}

export default MessageItems
