import React from "react"
import { Route } from "react-router-dom"
import { Dashboard } from "./users/Dashboard"


export const AppViews = props => (
    <>
        <Route exact path="/home" render={
            props => <Dashboard {...props} />
        } />

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