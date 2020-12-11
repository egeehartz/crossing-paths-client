import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
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
                        {f.friend.profile_img === null || f.friend.profile_img === undefined
                    ? <img src={defaultImg} width='50px' alt="profile" />
                    : <img src={f.friend.profile_img} width='50px' alt="profile" />
                }
                        <Link to={{ pathname: `/profile/${f.friend.id}`, state:{friend: f} }}>
                        {f.friend.full_name}
                        </Link>
                        </div>
                })
            }
            </div>
        </>
    )
}