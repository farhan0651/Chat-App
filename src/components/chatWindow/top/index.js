/* eslint-disable arrow-body-style */
import React,{memo} from 'react'
import { Link } from 'react-router-dom'
import { Icon,ButtonToolbar } from 'rsuite'
import { useMediaQuery } from '../../../misc/customHooks'
import { useCurrentRoom } from '../../../context/currentRoomContext'
import RoomInfoBtn from './RoomInfoBtn'
import EditRoomBtnDrawer from './EditRoomBtnDrawer'

const Top = () => {
    const name=useCurrentRoom(v=>v.name)
    const isAdmin=useCurrentRoom(v=>v.isAdmin)
    const isMobile=useMediaQuery('(max-width:992px)')

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center'>
             <h4 className='text-disappear d-flex align-items-center'>
                 <Icon componentClass={Link} to='/' icon='arrow-circle-left' size='2x' 
                 className={isMobile ? 'd-inline-block p-0 mr-2 text-blue link-unstyled' : 'd-none'} />
                 <spann className="text-disappear">{name}</spann>
                 </h4>
                 <ButtonToolbar className='ws-nowrap'>{isAdmin && <EditRoomBtnDrawer  />}</ButtonToolbar>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
            <span>todo</span>
            <RoomInfoBtn />
            </div>
        </div>
    )
}

export default memo(Top)
