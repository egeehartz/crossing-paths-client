import React from "react";
import { Link } from "react-router-dom"
import { Button } from "reactstrap";

export const Dashboard = () => {


    return (
        <>
            <h1>Dashboard</h1>
            <div className="activityButtons">
                <Link to="/homepage">
                    <Button>Home</Button>
                </Link>
                <Link to="/create">
                    <Button>Create</Button>
                </Link>
                <Link to="/friends">
                    <Button>Friends</Button>
                </Link>
                <Link to="/explore">
                    <Button>Explore</Button>
                </Link>
            </div>
            <div>
                <h2>Recent Activity</h2>

            </div>
        </>
    )
}