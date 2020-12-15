import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useForm, Controller } from "react-hook-form";
import { CategoryContext } from "./CategoryProvider";
import { DesignContext } from "./DesignProvider";
import "./DesignForm.css"



export const DesignForm = () => {
    const { categories, getCategories } = useContext(CategoryContext)
    const {addDesign} = useContext(DesignContext)
    const history = useHistory()

    useEffect(() => {
        getCategories()
    },[])

    const { register, handleSubmit, control } = useForm();
    const onSubmit = data => {
        const completeObj = addImageToData(data, designImg)
        console.log(completeObj)
        addDesign(completeObj)
        .then(() => {
            history.push('/homepage')
        })
    } 

    const addImageToData = (dataObj, stateVar) => {
        dataObj.designImg = stateVar
        return dataObj
    }


    const [designImg, setDesignImg] = useState('')

    const getBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(file);
    }

    const createProfileImageJSON = (event) => {
        getBase64(event.target.files[0], (base64ImageString) => {
            setDesignImg(base64ImageString)
        });
    }


    return (
        <>
            <h1>Add a New Design!</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Design Name:</label>
                <input className="designInput" name="title" ref={register} placeholder="name" />
                <label>Design Link:</label>
                <input className="designInput" name="link" ref={register} placeholder="link" />
                <label>Design Progress:</label>
                <select name="categoryId" ref={register} className="designInput">
                    <option value="0">Select a Category</option>
                    {
                        categories.map(c => <option value={c.id}>{c.label}</option>)
                    }

                </select>
                <Controller
                    name="designImg"
                    control={control}
                    // defaultValue={designImg}
                    rules={{ required: false }}
                    render={props =>
                        <>
                        <label>Image:</label>
                        <input
                        className="designInput chooseFile"
                            type="file"
                            // id="designImage"
                            onChange={e => createProfileImageJSON(e)}
                        />
                        </>
                    } // props contains: onChange, onBlur and value
                />
                <Controller
                    className="designInput"
                    name="public"
                    control={control}
                    defaultValue={false}
                    rules={{ required: false }}
                    render={props =>
                        <>
                        <div className="checkbox-public">
                      
                        <label className="publicLabel">Make Design Public</label>
                        <input
                            className="register-input"
                            type="checkbox"
                            checked= {props.value}
                            onChange={e => {
                                console.log(e.target.checked)
                                props.onChange(e.target.checked)}}
                        />
                        </div>
                        </>
                    } // props contains: onChange, onBlur and value
                />

                <input className="submitButton" type="submit" />
            </form>
        </>
    )
}