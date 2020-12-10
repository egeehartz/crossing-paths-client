import React from "react"
import "./HomeDesigns.css"




export const HomeDesigns = ({ design }) => {

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
                        <img className="image" src={design.design_img}  />
                        <p>{design.category.label}</p>
                        {design.link === "" ? <p>add link</p> : 
                        <a className="design_link"
                             href={design.link} target="_blank">source</a>}
                    </div>
                </div>
            </div>
        </>
    )
}