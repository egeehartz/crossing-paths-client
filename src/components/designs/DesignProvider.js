import React, { useState } from "react"

export const DesignContext = React.createContext()

export const DesignProvider = (props) => {
    const [designs, setDesigns] = useState([])  

    const getDesigns = () => {
        return fetch("http://localhost:8000/designs" , {
            headers: {
              Authorization: `Token ${localStorage.getItem("cp_user")}`,
              "Content-Type": "application/json",
            }
          })
            .then(res => res.json())
            .then(setDesigns)
    }

    const getExploreDesigns = () => {
      return fetch("http://localhost:8000/designs/explore" , {
            headers: {
              Authorization: `Token ${localStorage.getItem("cp_user")}`,
              "Content-Type": "application/json",
            }
          })
            .then(res => res.json())
    }

    const getDesignById = (id) => {
        return fetch(`http://localhost:8000/designs/${id}` , {
            headers: {
              Authorization: `Token ${localStorage.getItem("cp_user")}`,
              "Content-Type": "application/json",
            }
          })
            .then(res => res.json())
    }

    const getDesignByUser = (userId) => {
        return fetch(`http://localhost:8000/designs?user_id=${userId}` , {
            headers: {
              Authorization: `Token ${localStorage.getItem("cp_user")}`,
              "Content-Type": "application/json",   
            }
          })
            .then(res => res.json())
    }


    const getDesignsByUserAndCategory = (userId, categoryId) => {
        return fetch(`http://localhost:8000/designs?user_id=${userId}&category_id=${categoryId}` , {
            headers: {
              Authorization: `Token ${localStorage.getItem("cp_user")}`,
              "Content-Type": "application/json",   
            }
          })
            .then(res => res.json())
            //.then(setDesigns)
    }

    const addDesign = design => {
        return fetch("http://localhost:8000/designs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem("cp_user")}`
              },
            body: JSON.stringify(design)
        })
           .then(res => res.json())     
    }

    const updateDesign = design => {
        return fetch(`http://localhost:8000/designs/${design.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem("cp_user")}`
            },
            body: JSON.stringify(design)
        })
            .then(getDesigns)
    }

    const deleteDesign = (designId) => {
        return fetch(`http://localhost:8000/designs/${designId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem("cp_user")}`,
            },
        body: JSON.stringify(designId)
        })
            .then(getDesigns)
    }


    return (
        <DesignContext.Provider value={{
            designs, addDesign, getDesigns, setDesigns, getDesignById, getExploreDesigns, 
            updateDesign, getDesignsByUserAndCategory, getDesignByUser, deleteDesign}}>
            {props.children}
        </DesignContext.Provider>
    )
}