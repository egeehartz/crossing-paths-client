import React from "react"

export const FollowingsContext = React.createContext()

export const FollowingsProvider = (props) => {


    const getFriendsByFollower = (id) => {
        return fetch(`http://localhost:8000/follows?follower_id=${id}`, {
            headers: {
                Authorization: `Token ${localStorage.getItem("cp_user")}`,
                "Content-Type": "application/json",
              }
            })
            .then(res => res.json())
    }

    const getFollowersByFriend = (id) => {
        return fetch(`http://localhost:8000/follows?friend_id=${id}`, {
            headers: {
                Authorization: `Token ${localStorage.getItem("cp_user")}`,
                "Content-Type": "application/json",
              }
            })
            .then(res => res.json())
    }

    const createFollowing = subscriptionObj => {
        return fetch("http://localhost:8000/follows", {
            method: "POST",
            headers: {
                Authorization: `Token ${localStorage.getItem("cp_user")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(subscriptionObj)
        })
            .then(res => res.json())
    }

    const deleteFollowing = (followingId) => {
        return fetch(`http://localhost:8000/follows/${followingId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem("cp_user")}`,
            },
        body: JSON.stringify(followingId)
        })
    }

    return (
        <FollowingsContext.Provider value={{
            getFriendsByFollower, getFollowersByFriend, createFollowing, deleteFollowing
        }}>
            {props.children}
        </FollowingsContext.Provider>
    )
}