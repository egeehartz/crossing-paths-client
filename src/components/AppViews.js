import React from "react"
import { Route } from "react-router-dom"
import { CategoryProvider } from "./designs/CategoryProvider"
import { Dashboard } from "./users/Dashboard"
import { Homepage } from "./users/Homepage"


export const AppViews = props => (
    <>
        <CategoryProvider>
            <Route exact path="/" render={Dashboard} />
            <Route path="/homepage" render={Homepage} />
        </CategoryProvider>


        {/* 
        
        exact path= "/" => Dashboard
        path = "/home" => UserHome (?)
        path = "/create" => CreateDesign
        path = "/explore" => ExploreDesigns
        path = "/add" => AddDesign
        
        */}

        <Route path="/logout" render={
            (props) => {
                localStorage.removeItem("cp_user")
                props.history.push("/login")
            }
        } />
    </>
)