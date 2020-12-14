import React, {useState, useContext, useRef} from "react"
import { useLocation } from "react-router-dom"
import { Modal, ModalBody, ModalHeader, Button } from "reactstrap"
import ContentEditable from 'react-contenteditable'
import { FollowingsContext } from "../users/FriendProvider"
import "./DesignList.css"
import { DesignContext } from "./DesignProvider"




export const DesignList = ({ design }) => {
    const {changeDesignTitle} = useContext(DesignContext)
    const {createFollowing} = useContext(FollowingsContext)
    const location = useLocation()

    const titleRef = useRef(null)

    const splitLocation = location.pathname.split("/")

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const constructFollow = () => {
        createFollowing({friendId: design.user.id})
        .then(toggle)
    }

    const handleSubmit = (e) => {
        changeDesignTitle({
                    id: design.id,
                    title: titleRef.current.textContent             
                })
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
                        {location.pathname === "/homepage" ?
                        <ContentEditable innerRef={titleRef} onChange={(e) => handleSubmit(e)} id={design.id} html={design.title}/> : 
                        // <h4>{design.title}</h4> :
                        <h4>{design.title}</h4>
                        }

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