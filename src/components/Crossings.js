import React from "react"
import { Route, Redirect, useLocation } from "react-router-dom"
import { AppViews } from "./AppViews"
import { NavBar } from "./nav/NavBar"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"

export const Crossings = () => {
    const location = useLocation()
    
    return (
        <>
            <Route render={() => {
                if (localStorage.getItem("cp_user") && location.pathname !== "/") {
                    return (
                        <>
                            <Route render={props => <NavBar {...props} />} />
                            <Route render={props => <AppViews {...props} />} />
                        </>
                    )
                } else if (localStorage.getItem("cp_user") && location.pathname === "/") {
                    return (
                        <>
                            <Route render={props => <AppViews {...props} />} />
                        </>
                    )
                } else {
                    return <Redirect to="/login" />
                }
            }} />

            <Route path="/login" render={props => <Login {...props} />} />
            <Route path="/register" render={props => <Register {...props} />} />
        </>
    )
}