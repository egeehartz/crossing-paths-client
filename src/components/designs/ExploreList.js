import React, { useContext, useEffect, useState } from "react"
import { DesignContext } from "./DesignProvider"
import { DesignList } from "./DesignList"
import { CategoryContext } from "./CategoryProvider"
import "./ExploreList.css"



export const ExploreList = () => {
    const {getExploreDesigns} = useContext(DesignContext)
    const {categories, getCategories} = useContext(CategoryContext)
    const [eDesigns, setExploreDesigns] = useState([])
    const [changeHeard, setChange] = useState(true)
    const toggleChange = () => {changeHeard ? setChange(false) : setChange(true)}

    useEffect(() => {
        getCategories()
        getExploreDesigns()
            .then(res => setExploreDesigns(res))
    },[changeHeard])


    return(
        <>
        <div className="exploreDiv">
            {
                eDesigns.map(d => {
                    return <DesignList key={d.id} design={d} categories={categories} func={toggleChange} />
                })
            }
        </div>
        </>
    )
}