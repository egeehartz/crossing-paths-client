import React, { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {Modal, ModalBody, ModalHeader, Button} from "reactstrap"
import { CategoryContext } from "../designs/CategoryProvider"
import { DesignContext } from "../designs/DesignProvider"
import { DesignList } from "../designs/DesignList"
import { UserContext } from "./UserProvider"



export const FriendPage = () => {
    const { categories, getCategories } = useContext(CategoryContext)
    const { getDesignByUser } = useContext(DesignContext)

    const location = useLocation()
    const friend = location.state.friend


    const [userDesigns, setUserDesigns] = useState([])


    useEffect(() => {
        getCategories()
        getDesignByUser(friend.id)
            .then(setUserDesigns)
    }, [])

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);


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