import React, { useState } from "react"


export const UserContext = React.createContext();

export const UserProvider = (props) => {
    const [users, setUsers] = useState([{user:{}}])
    const [currentUser, setCurrentUser] = useState({user:{}})

  const getUsers = () => {
    return fetch("http://localhost:8000/users" , {
        headers: {
          Authorization: `Token ${localStorage.getItem("cp_user")}`,
          "Content-Type": "application/json",
        }
      })
      .then((response) => response.json())
      .then(setUsers);
  };

    const getUserById = (id) => {
        return fetch(`http://localhost:8000/users/${id}`, {
            headers: {
                Authorization: `Token ${localStorage.getItem("cp_user")}`,
                "Content-Type": "application/json",
              }
        })
            .then(response => response.json()) 
    }

    const getCurrentUser = () => {
        return fetch(`http://localhost:8000/currentuser`, {
            headers: {
                Authorization: `Token ${localStorage.getItem("cp_user")}`,
                "Content-Type": "application/json",
              }
        })
            .then(response => response.json())     
    }

    const getUsersToFollow = () => {
      return fetch(`http://localhost:8000/users/people_to_follow`, {
            headers: {
                Authorization: `Token ${localStorage.getItem("cp_user")}`,
                "Content-Type": "application/json",
              }
        })
            .then(response => response.json())
    }

    const changeProfilePicture = (picture, userId) => {
      return fetch(`http://localhost:8000/users/${userId}/change_profile_picture`, {
            method: "PATCH",
            headers: {
                Authorization: `Token ${localStorage.getItem("cp_user")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(picture)
        })
            .then(response => response.json())
    }
    

    
    return (
        <UserContext.Provider value={{
            users, getUsers, setUsers, getUserById, getCurrentUser, 
            setCurrentUser, currentUser, getUsersToFollow, changeProfilePicture}}>
            {props.children}
        </UserContext.Provider>
    )
}