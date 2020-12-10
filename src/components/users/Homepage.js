import React, { useContext, useEffect, useState } from "react"
import {Modal, ModalBody, ModalHeader, Button} from "reactstrap"
import { CategoryContext } from "../designs/CategoryProvider"
import { DesignContext } from "../designs/DesignProvider"
import { UserContext } from "./UserProvider"



export const Homepage = () => {
    const { categories, getCategories } = useContext(CategoryContext)
    const { getDesignByUser } = useContext(DesignContext)
    const { getCurrentUser } = useContext(UserContext)

    const [userDesigns, setUserDesigns] = useState([])


    useEffect(() => {
        getCategories()
        getCurrentUser()
            .then((user) => getDesignByUser(user.id))
            .then(setUserDesigns)
    }, [])

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);


    return (
        <>
            <h1>Homepage</h1>
            <div>
                {
                    categories.map(c => <div>{c.label}</div>)
                }
            </div>
            <br />
            <div>
                {
                    userDesigns.map(d => {
                        return <div>
                            <h4>{d.title}</h4>
                            {d.design_img === null ?
                                "no image" : <p>{d.design_image}</p>}
                        </div>
                    })
                }
            </div>
            <button onClick={toggle}>+</button>
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Add a Design!</ModalHeader>
                <ModalBody>
                    <Button color="primary" onClick={toggle}>Create a New One</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Upload an Existing design</Button>
                </ModalBody>
            </Modal>
        </>
    )
}