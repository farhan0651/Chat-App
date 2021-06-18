import React,{ createContext,useContext,useEffect,useState } from "react";
import { database } from '../misc/firebase'
import { tranformToArrayWithId } from '../misc/helpers';


const RoomsContext=createContext();

export const RoomsProvider=({children})=>{

    const [rooms,setRooms]=useState(null);

    useEffect(() => {
        const roomRef=database.ref('rooms')
        roomRef.on('value',snap=>{
            const data=tranformToArrayWithId(snap.val())
            setRooms(data);
        })
        return ()=>{
            roomRef.off();
        }
    },[])

    return(
        <RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
        );
}

export const useRooms=()=>useContext(RoomsContext)