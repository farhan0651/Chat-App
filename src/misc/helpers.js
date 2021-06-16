export function getNameInitials(name){
    const initials=name.toUpperCase().split(' ')
    if(initials.length>1){
        return initials[0][0]+initials[1][0]
    }
    return initials[0][0]
}