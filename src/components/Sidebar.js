/* eslint-disable arrow-body-style */
import React from 'react'
import DashboardToogle from './Dashboard/DashboardToogle'
import CreateRoomModal from './Dashboard/CreateRoomModal'

const Sidebar = () => {
    return (
        <div className="h-100 pt2">
            <div>
                <DashboardToogle />
                <CreateRoomModal/>
            </div>
            bottom
        </div>
    )
}

export default Sidebar
