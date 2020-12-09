import React, { useState } from "react";


export const CategoryContext = React.createContext();


export const CategoryProvider = (props) => {
  const [categories, setCategories] = useState([]);

  const getCategories = () => {
    return fetch("http://localhost:8000/categories", {
      headers: {
        "Authorization": `Token ${localStorage.getItem("cp_user")}`
      }
    })
      .then((res) => res.json())
      .then(setCategories);
  };


const getCategoryById = (id) => {
  return fetch(`http://localhost:8000/categories/${id}` , {
      headers: {
        Authorization: `Token ${localStorage.getItem("cp_user")}`,
        "Content-Type": "application/json",
      }
    })
      .then(res => res.json())
}

  return (
    <CategoryContext.Provider
      value={{categories, getCategories, setCategories, getCategoryById}}>
      {props.children}
    </CategoryContext.Provider>
  );
};