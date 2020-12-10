import React from "react"
import { Route } from "react-router-dom"
import { CategoryProvider } from "./designs/CategoryProvider"
import { DesignProvider } from "./designs/DesignProvider"
import { Dashboard } from "./users/Dashboard"
import { Homepage } from "./users/Homepage"
import { UserProvider } from "./users/UserProvider"


export const AppViews = props => (
    <>
        <CategoryProvider>
            <DesignProvider>
                <UserProvider>
                    <Route exact path="/" render={Dashboard} />
                    <Route exact path="/homepage"
                        render={(props) => <Homepage {...props} />}
                    />
                </UserProvider>
            </DesignProvider>
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