import React from "react"
import { useLocation } from "react-router-dom"
import { Button } from "reactstrap"
import "./DesignList.css"




export const DesignList = ({ design }) => {
    const location = useLocation()

    const splitLocation = location.pathname.split("/")

    return (
        <>
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <h4>{design.title}</h4>
                        <img className="image" src={design.design_img} alt="cross stitch pattern"/>
                    </div>


                    <div className="flip-card-back">
                        <h4>{design.title}</h4>
                        {/* posted by logic */}
                        {location.pathname === "/explore" ?
                            <p>posted by {design.user.full_name}</p>
                            : ""}
                        <img className="image" src={design.design_img} alt="cross stitch pattern"/>
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

                       
                    </div>
                </div>
            </div>
        </>
    )
}