import React from "react"
import "./HomeDesigns.css"




export const HomeDesigns = ({ design }) => {


    return (
        <>
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <h4>{design.title}</h4>
                        <p>{design.design_img}</p>
                    </div>
                    <div className="flip-card-back">
                        <h4>{design.title}</h4>
                        <p>{design.design_img}</p>
                        <p>{design.category.label}</p>
                        {design.link === "" ? "" : <p>{design.link}</p>}
                    </div>
                </div>
            </div>
        </>
    )
}