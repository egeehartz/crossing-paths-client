import React from "react"
import {useLocation} from "react-router-dom"
import {Button} from "reactstrap"
import "./HomeDesigns.css"




export const HomeDesigns = ({ design }) => {
    const location = useLocation()

    return (
        <>
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <h4>{design.title}</h4>
                        <img className="image" src={design.design_img}  />
                    </div>
                    <div className="flip-card-back">
                        <h4>{design.title}</h4>
                        {/* posted by logic */}
                        {location.pathname === "/explore" ?
                            <p>posted by {design.user.full_name}</p> 
                            : ""}
                        <img className="image" src={design.design_img}  />
                        <p>{design.category.label}</p>

                        {design.link !== "" ? 
                           <a className="design_link"
                           href={design.link} target="_blank">source</a> :
                           location.pathname === "/explore" & design.link === "" ? 
                            "" :
                            location.pathname !== "/explore" & design.link === "" ? 
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