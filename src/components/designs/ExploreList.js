import React, { useContext, useEffect, useState } from "react"
import { DesignContext } from "./DesignProvider"
import { HomeDesigns } from "./HomeDesigns"



export const ExploreList = () => {
    const {getExploreDesigns} = useContext(DesignContext)
    const [eDesigns, setExploreDesigns] = useState([])

    useEffect(() => {
        getExploreDesigns()
            .then(res => setExploreDesigns(res))
    },[])


    return(
        <>
        <h1>Explore!</h1>
        <div>
            {
                eDesigns.map(d => {
                    return <HomeDesigns key={d.id} design={d} />
                })
            }
        </div>
        </>
    )
}