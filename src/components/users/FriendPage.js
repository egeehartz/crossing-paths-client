import React, { useContext, useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { CategoryContext } from "../designs/CategoryProvider"
import { DesignContext } from "../designs/DesignProvider"
import { DesignList } from "../designs/DesignList"



export const FriendPage = () => {
    const { categories, getCategories } = useContext(CategoryContext)
    const { getDesignByUser, getDesignsByUserAndCategory } = useContext(DesignContext)

    const params = useParams()
    const friendId = parseInt(params.friendId)

    const location = useLocation()
    const friend = location.state.friendObj.friend    
    
    const [userDesigns, setUserDesigns] = useState([])
    const [all, setAll] = useState(true)
    const [categorySelected, setCategorySelected] = useState("")

    
    useEffect(() => {
        getCategories()
        getDesignByUser(friendId)
            .then(setUserDesigns)
    },[all])

    useEffect(() => {
        //if categorySelected is empty, don't do anything (avoids error in the network tab)
        if(categorySelected !== ""){
            const userId = friendId
            setAll(false)
            getDesignsByUserAndCategory(userId, categorySelected)
                .then(setUserDesigns)
        } 
    }, [categorySelected])

    //resets the state variables tracking the radio buttons
    const clearFilterButton = () => {
        setCategorySelected("")
        setAll(true)
    }


    return (
        <>
            <h1>{friend.username}'s Page</h1>
            <div>
                {
                    categories.map(c => {
                        return <div key={c.id}>
                            <input
                                type="radio"
                                value={c.id}
                                name="categories"
                                onChange={() => { setCategorySelected(c.id) }}
                            />{" "}
                            {c.label}
                        </div>
                    })

                }
                <div>
                    <input
                    type="radio"
                    value={0}
                    name="categories"
                    onChange={clearFilterButton}
                    />{" "}
                    All
                </div>
            </div>
            <br />
            <div>
                {
                    userDesigns.map(d => {
                        return <DesignList key={d.id} design={d} categories={categories} />
                    })
                }
            </div>
        </>
    )
}