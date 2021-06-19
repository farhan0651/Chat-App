/* eslint-disable arrow-body-style */
import React from 'react'
import {Grid,Row,Col} from 'rsuite'
import { Route, useRouteMatch } from 'react-router'
import Sidebar from '../../components/Sidebar'
import { RoomsProvider } from '../../context/roomsContext'
import Chat from './Chat'
import { useMediaQuery } from '../../misc/customHooks'

const Home = () => {

    const isDesktop=useMediaQuery('(min-width:992px)')
    const {isExact}=useRouteMatch()
    const canRennderSidebar= isDesktop || isExact

    return (
        <RoomsProvider>
        <Grid fluid className="h-100">
            <Row className="h-100">
                {canRennderSidebar &&
                (<Col xs={24} md={8} className="h-100">
                    <Sidebar />
                </Col>)
                }
                <switch>
                    <Route exact path='/chat/:chatId'>
                        <Col xs={24} md={16} className='h-100' >
                            <Chat />
                        </Col>
                    </Route>
                    <Route>
                        {isDesktop &&
                        (<Col xs={24} md={16} className='h-100'>
                            <h6 className='text-center mt-page' >Please Select a chat</h6>
                        </Col>)
                        }
                    </Route>
                </switch>
            </Row>
        </Grid>
        </RoomsProvider>
    )
}

export default Home
