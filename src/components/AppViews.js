import React from "react"
import { Route } from "react-router-dom"
import { CategoryProvider } from "./designs/CategoryProvider"
import { DesignProvider } from "./designs/DesignProvider"
import { UserProvider } from "./users/UserProvider"
import { Dashboard } from "./users/Dashboard"
import { Homepage } from "./users/Homepage"
import { DesignForm } from "./designs/DesignForm"
import { ExploreList } from "./designs/ExploreList"


export const AppViews = props => (
    <>
        <CategoryProvider>
            <DesignProvider>
                <UserProvider>
                    <Route exact path="/" render={Dashboard} />
                    <Route exact path="/homepage"
                        render={(props) => <Homepage {...props} />}
                    />
                    <Route path="/add"
                        render={props => <DesignForm {...props} />} 
                    />
                    <Route path="/explore"
                        render={props => <ExploreList {...props} />} 
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