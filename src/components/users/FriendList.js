import React, { useContext, useEffect, useState } from "react"
import { FollowingsContext } from "./FriendProvider"
import { UserContext } from "./UserProvider"




export const FriendList = () => {
    const {getCurrentUser} = useContext(UserContext)
    const {getFriendsByFollower} = useContext(FollowingsContext)

    const [friends, setFriends] = useState([])
    
    useEffect(() => {
        getCurrentUser()
        .then(user => {
            getFriendsByFollower(user.id)
            .then(setFriends)
        })
    },[])


    return (
        <>
            <h1>Friends</h1>
            <div>
            {
                friends.map(f => {
                    return <div>
                        <img src={f.friend.profile_img} />
                        {f.friend.full_name}
                        </div>
                })
            }
            </div>
        </>
    )
}