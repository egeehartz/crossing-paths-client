import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Modal, ModalBody, ModalHeader, Button } from "reactstrap"
import { CategoryContext } from "../designs/CategoryProvider"
import { DesignContext } from "../designs/DesignProvider"
import { DesignList } from "../designs/DesignList"
import { UserContext } from "./UserProvider"
import defaultImg from "./images/default.png"



export const Homepage = () => {
    const { categories, getCategories } = useContext(CategoryContext)
    const { getDesignByUser, getDesignsByUserAndCategory } = useContext(DesignContext)
    const { getCurrentUser } = useContext(UserContext)

    const [userDesigns, setUserDesigns] = useState([])
    const [user, setUser] = useState([])
    const [categorySelected, setCategorySelected] = useState(0)


    const [changeHeard, setChange] = useState(true)
    const toggleChange = () => {changeHeard ? setChange(false) : setChange(true)}

    useEffect(() => {
        getCategories()
        getCurrentUser()
            .then((user) => {
                setUser(user)
                getDesignByUser(user.id)
                    .then(setUserDesigns)
            })
    }, [changeHeard])

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);


    useEffect(() => {
        //if categorySelected is empty, don't do anything (avoids error in the network tab)
        if(categorySelected !== 0){
            const userId = user.id
            getDesignsByUserAndCategory(userId, categorySelected)
                .then(setUserDesigns)
        } else {
            getCurrentUser()
            .then((user) => {
                setUser(user)
                getDesignByUser(user.id)
                    .then(setUserDesigns)
            })
        }
    }, [categorySelected])


    const addProfilePicture = () => {

    }


    return (
        <>
            <h1>Homepage</h1>
            {user.profile_img === null || user.profile_img === undefined
                ? <img src={defaultImg} width='50px' alt="profile" />
                : <img src={user.profile_img} width="50px" alt="profile" />}
            {/* <h4>{user.user.username}</h4> */}
            <div>
                {
                    categories.map(c => {
                        return <div key={"c", c.id}>
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
                    {/* <button onClick={clearFilterButton}>
                    All
                    </button> */}
                    <input
                                type="radio"
                                value={0}
                                name="categories"
                                onChange={() => { setCategorySelected(0) }}
                            />{" "}
                            {"all"}
                </div>
            </div>
            <br />
            <div>
                {
                    userDesigns.map(d => {
                        return <DesignList key={d.id} design={d} categeory={categorySelected} func={toggleChange}/>
                    })
                }
            </div>
            <button onClick={toggle}>+</button>
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Add a Design!</ModalHeader>
                <ModalBody>
                    <Link to="/create">
                        <Button color="primary" onClick={toggle}>Create a New One</Button>{' '}
                    </Link>
                    <Link to="/add">
                        <Button color="secondary" onClick={toggle}>Upload an Existing design</Button>
                    </Link>
                </ModalBody>
            </Modal>


            {/* photo upload modal */}
            <Modal isOpen={photoModal} toggle={togglePhotoModal} >
                <ModalHeader toggle={togglePhotoModal}>Change Profile Picture</ModalHeader>
                <ModalBody>
                    <input type="file" name="profile_img" onChange={e => createProfileImageJSON(e)} />
                </ModalBody>
            </Modal>
        </>
    )
}