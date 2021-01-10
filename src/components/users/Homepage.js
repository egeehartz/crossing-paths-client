import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from "reactstrap"
import { CategoryContext } from "../designs/CategoryProvider"
import { DesignContext } from "../designs/DesignProvider"
import { DesignList } from "../designs/DesignList"
import { UserContext } from "./UserProvider"
import defaultImg from "./images/default.png"
import AddIcon from '@material-ui/icons/Add';
import "./Homepage.css"


export const Homepage = () => {
    const { categories, getCategories } = useContext(CategoryContext)
    const { getDesignByUser, getDesignsByUserAndCategory } = useContext(DesignContext)
    const { getCurrentUser, changeProfilePicture } = useContext(UserContext)

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
    const [photoModal, setPhotoModal] = useState(false);
    const togglePhotoModal = () => {
        setProfilePic('')
        setPhotoModal(!photoModal);
    }


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
        const picture = {
            profile_img: profilePic
        }
        changeProfilePicture(picture, user.id)
        .then(setProfilePic(''))
    }

    const [profilePic, setProfilePic] = useState('')

    const getBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(file);
    }

    const createProfileImageJSON = (event) => {
        getBase64(event.target.files[0], (base64ImageString) => {
            setProfilePic(base64ImageString)
        });
    }

    return (
        <>
            {user.profile_img === null || user.profile_img === undefined
                ? <img className="profPic" src={defaultImg} width='100px' alt="profile" onClick={togglePhotoModal}/>
                : <img className="profPic" src={user.profile_img} width="100px" alt="profile" onClick={togglePhotoModal} />}
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
                <Button className="sortButtons add-btn" color="info" onClick={toggle}><AddIcon /></Button>
            </div>
            <div className="homepageDiv">
                {
                    userDesigns.map(d => {
                        return <DesignList key={d.id} design={d} categories={categories} func={toggleChange}/>
                    })
                }
            </div>
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
                    <div>
                        <p>current picture</p>
                        <img src={user.profile_img} width="75px" />
                    </div>
                    <div>
                        <p>new</p>
                        {profilePic !== "" ? <img src={profilePic} width="75px" /> : ""}
                    </div>
                    <input type="file" name="profile_img" onChange={e => createProfileImageJSON(e)} />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={addProfilePicture}>Save</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}