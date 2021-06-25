/* eslint-disable arrow-body-style */
import React from 'react'
import { Badge,Whisper,IconButton, Tooltip, Icon } from 'rsuite'

const ConditinalBadge=(condition,children)=>{
    return condition ? <Badge content={condition} >{children}</Badge> : children
}

const IconBtnControl = ({isVisible,iconName,tooltip,onClick,badgeContent,...props}) => {
    return (
        <div className='ml-2' style={{visibility: isVisible ? 'visible' : 'hidden'}} >
            <ConditinalBadge>
                <Whisper
                placement='top'
                delay={0}
                delayHide={0}
                delayShow={0}
                trigger='hover'
                speaker={<Tooltip>{tooltip}</Tooltip>}
                >
                    <IconButton
                        {...props}
                        onClick={onClick}
                        circle
                        size='xs'
                        icon={<Icon icon={iconName}   />}
                    />
                </Whisper>
            </ConditinalBadge>
        </div>
    )
}

export default IconBtnControl
