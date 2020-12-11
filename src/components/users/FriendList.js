import React, { useContext, useEffect, useState } from "react"
import { FollowingsContext } from "./FriendProvider"
import { UserContext } from "./UserProvider"
import defaultImg from "./images/default.png"




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
                        {f.friend.profile_img === "" || f.friend.profile_img === null
                    ? <img src={defaultImg} alt="default avatar smiley" width='50px' />
                    : <img src={f.friend.profile_img} width='50px' />
                }
                        {f.friend.full_name}
                        </div>
                })
            }
            </div>
        </>
    )
}