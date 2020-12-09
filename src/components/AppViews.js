import React from "react"
import { Route } from "react-router-dom"
import { Dashboard } from "./users/Dashboard"
import { Homepage } from "./users/Homepage"


export const AppViews = props => (
    <>
        <Route exact path="/" render={Dashboard} />
        <Route path="/homepage" render={Homepage} />


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