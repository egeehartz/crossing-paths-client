import React, { useState, useContext, useEffect } from "react"
import { useLocation, useHistory } from "react-router-dom"
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from "reactstrap"
import { FollowingsContext } from "../users/FriendProvider"
import "./DesignList.css"
import { DesignContext } from "./DesignProvider"

// * THIS MODULE REPRESENTS A SINGLE DESIGN CARD


export const DesignList = ({ design, categories, func }) => {
    // CONTEXT, HOOKS, STATE VAR
    const { deleteDesign, addDesign } = useContext(DesignContext)
    const { createFollowing } = useContext(FollowingsContext)
    const location = useLocation()
    const history = useHistory()
    const [designObj, setDesignObj] = useState({ label:{} })

    // MODALS AND THEIR TOGGLE FUNCTIONS
    const [modal, setModal] = useState(false); // * MODAL TO FOLLOW OTHER USERS
    const toggle = () => setModal(!modal);
    const [addModal, setAddModal] = useState(false); // * MODAL TO ADD DESIGN TO YOUR BOARD
    const toggleAddModal = () => setAddModal(!addModal);
    const [photoModal, setPhotoModal] = useState(false); // * MODAL TO SEE A LARGER VERSION OF THE IMAGE
    const togglePhotoModal = () => setPhotoModal(!photoModal);

    // SETS DESIGN OBJ TO PREPARE TO CREATE A NEW DESIGN OBJ
    useEffect(() => {
        setDesignObj(design)
    },[])

    // CREATES FOLLOWING
    const constructFollow = () => {
        createFollowing({ friendId: design.user.id })
            .then(() => {
                toggle() // * CLOSE MODAL AFTER FOLLOWING CREATED
                func()  // * trigger the useEffect on ExploreList so the Username isn't in a button to follow again
            }) 

    }

    // TRACKS CHANGES OF DESIGN OBJ PROPERTIES
    const onChange = (e) => {
        const newDesign = Object.assign({}, design)
        if (e.target.name === "public") {
            newDesign[e.target.name] = e.target.checked
        } else {
            newDesign[e.target.name] = e.target.value
        }
        setDesignObj(newDesign)
    }

    // ADDS DESIGN TO YOUR OWN BOARDS
    const addToBoard = () => {
        addDesign({
            "link": designObj.link,
            "title": designObj.title,
            "design_img": designObj.design_img,
            "public": designObj.public,
            "category_id": designObj.category_id
        })
        .then(toggleAddModal) // * CLOSE MODAL AFTER OBJECT IS CREATED
    }

    return (
        <>
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <h4>{design.title}</h4>
                        <img className="image" src={design.design_img} alt="cross stitch pattern" />
                    </div>
                    <div className="flip-card-back">
                        <h4>{design.title}</h4>  
                        {/* posted by logic: if on explore, show who it is posted by */}
                        {location.pathname === "/explore" ? 
                            <p> posted by
                                { //puts the username in a button if not already following
                                    design.created_by_friend ? 
                                        <>{" "}{design.user.full_name} </> :
                                        <button onClick={toggle}>
                                            {design.user.full_name}
                                        </button>
                                }
                            </p>
                            : ""}
                        <img onClick={togglePhotoModal} className="image" src={design.design_img} alt="cross stitch pattern" />
                        <div className="designDetails">
                            {/* add to board logic, only if on explore */}
                            {location.pathname === "/explore" ?
                                <div>
                                    <Button color="info" size="sm" onClick={toggleAddModal}>+</Button>
                                </div>
                                : ""}
                            <p>Category: <br />{design.category.label}</p>
                            {/* design link rendering depending on if there is a link */}
                            {
                                design.link === "" || design.link === "empty" ?
                                    ""
                                    :
                                    <a  className="design_link"
                                        href={design.link} 
                                        target="_blank">
                                        source
                                    </a> 
                            }
                        </div>
                        {/* edit/delete logic, only shows on homepage */}
                        {location.pathname === "/homepage" ?
                            <div className="personalButtons">
                                <Button color="info" size="sm" onClick={() => {
                                    deleteDesign(design.id)
                                        .then(func) // * toggleChange to trigger useEffect to make design disappear
                                }}>X</Button>
                                <Button color="info" size="sm" 
                                    onClick={() => {
                                        history.push(`/edit/${design.id}`)
                                    }}>EDIT</Button>
                            </div>
                            : ""}
                        {/* Modal to Follow User */}
                        <Modal isOpen={modal} toggle={toggle} >
                            <ModalHeader toggle={toggle}>Follow {design.user.full_name}?</ModalHeader>
                            <ModalBody>
                                <Button className="follow-btn" color="info" onClick={constructFollow}>Follow!</Button>{' '}
                                <Button color="primary" onClick={toggle}>nevermind</Button>
                            </ModalBody>
                        </Modal>
                        {/* Modal to Add Design to Board */}
                        <Modal isOpen={addModal} toggle={toggleAddModal} >
                            <ModalHeader>Save To Your Board!</ModalHeader>
                            <ModalBody>
                                <form>
                                    <label>Design Name:</label>
                                <input className="designInput" type="text" name="title" onChange={onChange} placeholder={design.title}></input>
                                <label>Organize Design:</label>
                                <select className="designInput" name="category_id" onChange={onChange} >
                                    <option value="0">Select a Category</option>
                                    {
                                        categories.map(c => <option value={c.id}>{c.label}</option>)
                                    }

                                </select>
                                <div className="checkbox-public">
                                <label className="publicLabel">Make Design Public</label>
                                <input
                                onChange={onChange}
                                    type="checkbox"
                                    name="public"
                                    className="register-input2"
                                />
                                </div>
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={toggleAddModal}>nevermind</Button>
                                <Button color="info" onClick={addToBoard}>Save</Button>
                            </ModalFooter>
                        </Modal>
                        {/* Modal that shows a larger image */}
                        <Modal isOpen={photoModal} toggle={togglePhotoModal}>
                            <ModalHeader>{design.title}</ModalHeader>
                            <ModalBody>
                             <img className="imageModal" src={design.design_img} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={togglePhotoModal}>close</Button>
                            </ModalFooter>
                        </Modal>

                    </div>
                </div>
            </div>
        </>
    )
}