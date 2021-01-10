import React from "react"
import { Link, useLocation } from "react-router-dom"
import "./NavBar.css"

export const NavBar = (props) => {
    const location = useLocation()
    const path = location.pathname

    return (
        <ul className="navbar">
            <Link className={path === "/homepage" ? "onPage" : "navbar__item"} to="/homepage">
                Home
            </Link>
            <Link className={path === "/" ? "onPage" : "navbar__item"} to="/">
                Dashboard
            </Link>
            <Link className={path === "/explore" ? "onPage" : "navbar__item"} to="/explore">
                Explore
            </Link>
            <Link className={path === "/create" ? "onPage" : "navbar__item"} to="/create">
                Create
            </Link>
            <Link className={path === "/friends" ? "onPage" : "navbar__item"} to="/friends">
                Friends
            </Link>
            {
                (localStorage.getItem("cp_user") !== null) ?
                    <div className="navbar__item">
                        <Link className="navbar__item"
                            to="/"
                            onClick={() => {
                                localStorage.removeItem("cp_user")
                            }}
                        >Logout</Link>
                    </div> :
                    <>
                        <li className="nav-item">
                            <Link className="navbar__item"to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="navbar__item"to="/register">Register</Link>
                        </li>
                    </>
            }        </ul>
    )
}