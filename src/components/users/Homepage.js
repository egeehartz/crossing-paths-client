import React, { useContext, useEffect } from "react"
import {CategoryContext} from "../designs/CategoryProvider"



export const Homepage = () => {
const {categories, getCategories} = useContext(CategoryContext)

useEffect(() => {
    getCategories()
},[])

console.log(categories)

    return(
        <>
        <h1>Homepage</h1>
        <div>
            {/* {
                categories.map(c => <div>{c.label}</div>)
            } */}
        </div>
        </>
    )
}