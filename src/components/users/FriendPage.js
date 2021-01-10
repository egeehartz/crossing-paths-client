import React, { useContext, useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { CategoryContext } from "../designs/CategoryProvider"
import { DesignContext } from "../designs/DesignProvider"
import { DesignList } from "../designs/DesignList"
import { Button } from "reactstrap"



export const FriendPage = () => {
    const { categories, getCategories } = useContext(CategoryContext)
    const { getDesignByUser, getDesignsByUserAndCategory } = useContext(DesignContext)

    const params = useParams()
    const friendId = parseInt(params.friendId)

    const location = useLocation()
    const friend = location.state.friendObj.friend    
    
    const [userDesigns, setUserDesigns] = useState([])
    const [categorySelected, setCategorySelected] = useState(0)

    
    useEffect(() => {
        getCategories()
        getDesignByUser(friendId)
            .then(setUserDesigns)
    },[])

    useEffect(() => {
        //if categorySelected is empty, don't do anything (avoids error in the network tab)
        if(categorySelected !== 0){
            getDesignsByUserAndCategory(friendId, categorySelected)
                .then(setUserDesigns)
        } else {
                getDesignByUser(friendId)
                    .then(setUserDesigns)
        }
    }, [categorySelected])

    return (
        <>
            <h1>{friend.username}'s Page</h1>
            <div className="categoryOptions">
                <div>
                    <Button className="sortButtons"
                    color={categorySelected === 0 ? "info" : "primary"}
                    onClick={() => setCategorySelected(0)}>
                    All
                    </Button>
                </div>
                {
                    categories.map(c => {
                        return <div key={"c", c.id}>
                            <Button
                            className="sortButtons"
                            color={categorySelected === c.id ? "info" : "primary"}
                            value={c.id}
                            onClick={() => { setCategorySelected(c.id) }}
                            >
                            {c.label}
                            </Button>
                        </div>
                    })

                }
            </div>
            <br />
            <div className="friendDiv">
                {
                    userDesigns.map(d => {
                        return <DesignList key={d.id} design={d} categories={categories} />
                    })
                }
            </div>
        </>
    )
}