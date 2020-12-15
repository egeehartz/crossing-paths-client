import React, {useState, useContext} from "react"
import { useLocation, useHistory } from "react-router-dom"
import { Modal, ModalBody, ModalHeader, Button } from "reactstrap"
import { FollowingsContext } from "../users/FriendProvider"
import "./DesignList.css"
import { DesignContext } from "./DesignProvider"




export const DesignList = ({design, category, func}) => {
    const {deleteDesign} = useContext(DesignContext)
    const {createFollowing} = useContext(FollowingsContext)
    const location = useLocation()
    const history = useHistory()


    const splitLocation = location.pathname.split("/")

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const constructFollow = () => {
        createFollowing({friendId: design.user.id})
        .then(toggle)
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
                                <button onClick={toggle}>
                                    {design.user.full_name}
                                </button>
                            </p>
                            : ""}


                        <img className="image" src={design.design_img} alt="cross stitch pattern" />
                        <p>{design.category.label}</p>


                        {/* design link rendering depending on /explore */}
                        {design.link !== "" ?
                            <a className="design_link"
                                href={design.link} target="_blank">source</a> :
                            (location.pathname === "/explore" || splitLocation[1] === "profile") && design.link === "" ?
                                "" :
                                location.pathname !== "/explore" && design.link === "" ?
                                    <p>add link</p> : ""}



                        {/* add to board logic */}
                        {location.pathname === "/explore" ?
                            <Button>+</Button>
                            : ""}


                        {/* edit/delete logic */}
                        {location.pathname === "/homepage" ?
                        <>
                            <Button onClick={() => {
                                deleteDesign(design.id)
                                .then(func)
                            }}>X</Button>
                            <Button 
                                onClick={() =>{
                                    history.push(`/edit/${design.id}`)
                                }}>EDIT</Button>
                        </>
                            : ""}


                        {/* Modal to Follow User */}
                        <Modal isOpen={modal} toggle={toggle} >
                            <ModalHeader toggle={toggle}>Follow {design.user.username}</ModalHeader>
                            <ModalBody>
                                    <Button color="primary" onClick={constructFollow}>Follow!</Button>{' '}
                                    <Button color="secondary" onClick={toggle}>nevermind</Button>
                            </ModalBody>
                        </Modal>

                    </div>
                </div>
            </div>
        </>
    )
}