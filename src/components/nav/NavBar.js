import React from "react"
import { Link } from "react-router-dom"
import "./NavBar.css"

export const NavBar = (props) => {
    return (
        <ul className="navbar">
            <Link className="navbar__item" to="/homepage">
                Home
            </Link>
            <Link className="navbar__item" to="/">
                Dashboard
            </Link>
            <Link className="navbar__item" to="/explore">
                Explore
            </Link>
            <Link className="navbar__item" to="/create">
                Create
            </Link>
            <Link className="navbar__item" to="/friends">
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