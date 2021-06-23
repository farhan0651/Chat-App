/* eslint-disable arrow-body-style */
export function getNameInitials(name){
    const initials=name.toUpperCase().split(' ')
    if(initials.length>1){
        return initials[0][0]+initials[1][0]
    }
    return initials[0][0]
}

export function tranformToArrayWithId(snapVal){
    return snapVal ? Object.keys(snapVal).map(RoomID=>{
        return {...snapVal[RoomID],id:RoomID}}) : [];
}

export async function getUserUpdates(userId,keyToUpdate,value,db){
    const updates={}
    updates[`/profiles/${userId}/${keyToUpdate}`]=value

    const getMessage=db.ref('/messages').orderByChild(`/author/uid`).equalTo(userId).once('value')
    const getRooms=db.ref('/rooms').orderByChild('/lastMessage/author/uid').equalTo(userId).once('value')

    const [msgSnapshot,roomSnapshot]= await Promise.all([getMessage,getRooms]);
    msgSnapshot.forEach(msgSnap=>{
        updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`]=value
    })
    roomSnapshot.forEach(roomSnap=>{
        updates[`/rooms/${roomSnap.key}/lastMessage/author/${keyToUpdate}`]=value
    })

    return updates

}

export function tranformToArray(snapVal){
    return snapVal ? Object.keys(snapVal) : []
}