import React, { useState, useContext, useEffect } from "react"
import { useLocation, useHistory } from "react-router-dom"
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from "reactstrap"
import { FollowingsContext } from "../users/FriendProvider"
import { CategoryContext } from "./CategoryProvider"
import "./DesignList.css"
import { DesignContext } from "./DesignProvider"

// * THIS MODULE REPRESENTS A SINGLE DESIGN CARD


export const DesignList = ({ design, categories, func }) => {
    const { deleteDesign, addDesign } = useContext(DesignContext)
    const { createFollowing } = useContext(FollowingsContext)

    const location = useLocation()
    const history = useHistory()
    const [designObj, setDesignObj] = useState({ label:{} })


    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [addModal, setAddModal] = useState(false);
    const toggleAddModal = () => setAddModal(!addModal);

    useEffect(() => {
        setDesignObj(design)
    },[])


    const constructFollow = () => {
        createFollowing({ friendId: design.user.id })
            .then(toggle)
    }

    const onChange = (e) => {
        const newDesign = Object.assign({}, design)
        if (e.target.name === "public") {
            newDesign[e.target.name] = e.target.checked
        } else {
            newDesign[e.target.name] = e.target.value
        }
        setDesignObj(newDesign)
    }

    const addToBoard = () => {
        addDesign({
            "link": designObj.link,
            "title": designObj.title,
            "design_img": designObj.design_img,
            "public": designObj.public,
            "category_id": designObj.category_id
        })
        .then(toggleAddModal)
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
                        
                        {/* posted by logic */}
                        {location.pathname === "/explore" ?
                            <p>
                                posted by
                                {design.created_by_friend ? 
                                   <p> {design.user.full_name} </p>
                                    :
                                <button onClick={toggle}>
                                    {design.user.full_name}
                                </button>
                                }
                            </p>
                            : ""}
                        
                        <img className="image" src={design.design_img} alt="cross stitch pattern" />

                        <div className="designDetails">
                        {/* add to board logic */}
                        {location.pathname === "/explore" ?
                            <div>
                                <Button color="info" size="sm" onClick={toggleAddModal}>+</Button>
                            </div>
                            : ""}
                        <p>{design.category.label}</p>
                        {/* design link rendering depending on /explore */}
                        {design.link === "" || design.link === "empty" ?
                                ""
                                :
                                <a className="design_link"
                                    href={design.link} target="_blank">source</a> 
                            }
                        </div>




                        {/* edit/delete logic */}
                        {location.pathname === "/homepage" ?
                            <div className="personalButtons">
                                <Button color="info" size="sm" onClick={() => {
                                    deleteDesign(design.id)
                                        .then(func)
                                }}>X</Button>
                                <Button color="info" size="sm" 
                                    onClick={() => {
                                        history.push(`/edit/${design.id}`)
                                    }}>EDIT</Button>
                            </div>
                            : ""}


                        {/* Modal to Follow User */}
                        <Modal isOpen={modal} toggle={toggle} >
                            <ModalHeader toggle={toggle}>Follow {design.user.username}</ModalHeader>
                            <ModalBody>
                                <Button color="info" onClick={constructFollow}>Follow!</Button>{' '}
                                <Button color="primary" onClick={toggle}>nevermind</Button>
                            </ModalBody>
                        </Modal>

                        {/* Modal to Add Design to Board */}
                        <Modal isOpen={addModal} toggle={toggleAddModal}>
                            <ModalHeader>Save To Your Board!</ModalHeader>
                            <ModalBody>
                                <input type="text" name="title" onChange={onChange} placeholder={design.title}></input>
                                <select name="category_id" onChange={onChange} >
                                    <option value="0">Select a Category</option>
                                    {
                                        categories.map(c => <option value={c.id}>{c.label}</option>)
                                    }

                                </select>
                                <label className="publicLabel">Make Design Public</label>
                                <input
                                onChange={onChange}
                                    type="checkbox"
                                    name="public"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={toggleAddModal}>nevermind</Button>
                                <Button onClick={addToBoard}>Save</Button>
                            </ModalFooter>
                        </Modal>

                    </div>
                </div>
            </div>
        </>
    )
}