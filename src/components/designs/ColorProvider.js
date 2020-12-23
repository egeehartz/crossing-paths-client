import React, { useState } from "react";


export const ColorContext = React.createContext();


export const ColorProvider = (props) => {
  const [colors, setColors] = useState([]);

  const getColors = () => {
    return fetch("http://localhost:8000/colors", {
      headers: {
        "Authorization": `Token ${localStorage.getItem("cp_user")}`,
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then(setColors);
  };

  return (
    <ColorContext.Provider
      value={{colors, getColors}}>
      {props.children}
    </ColorContext.Provider>
  );
};