import React, { useContext, useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { CategoryContext } from "../designs/CategoryProvider"
import { DesignContext } from "../designs/DesignProvider"
import { DesignList } from "../designs/DesignList"



export const FriendPage = () => {
    const { categories, getCategories } = useContext(CategoryContext)
    const { getDesignByUser } = useContext(DesignContext)

    const params = useParams()
    const friendId = parseInt(params.friendId)

    const location = useLocation()
    const friend = location.state.friendObj.friend    
    
    const [userDesigns, setUserDesigns] = useState([])

    
    useEffect(() => {
        getCategories()
        getDesignByUser(friendId)
            .then(setUserDesigns)
    },[])


    return (
        <>
            <h1>{friend.username}'s Page</h1>
            <div>
                {
                    categories.map(c => <div>{c.label}</div>)
                }
            </div>
            <br />
            <div>
                {
                    userDesigns.map(d => {
                        return <DesignList key={d.id} design={d} />
                    })
                }
            </div>
        </>
    )
}