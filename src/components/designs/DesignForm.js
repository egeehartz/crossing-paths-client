import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useForm, Controller } from "react-hook-form";
import { CategoryContext } from "./CategoryProvider";
import { DesignContext } from "./DesignProvider";



export const DesignForm = () => {
    const { categories, getCategories } = useContext(CategoryContext)
    const {addDesign} = useContext(DesignContext)
    const history = useHistory()

    useEffect(() => {
        getCategories()
    }, [])

    const { register, handleSubmit, control } = useForm();
    const onSubmit = data => {
        const completeObj = addImageToData(data, designImg)
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
                <input name="title" ref={register} placeholder="name" />
                <label>Design Link:</label>
                <input name="link" ref={register} placeholder="link" />
                <select name="categoryId" ref={register} >
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
                        <input
                            className="register-input"
                            type="file"
                            // id="designImage"
                            onChange={e => createProfileImageJSON(e)}
                        />
                    } // props contains: onChange, onBlur and value
                />
                <Controller
                    name="public"
                    control={control}
                    // defaultValue={designImg}
                    rules={{ required: true }}
                    render={props =>
                        <>
                        <label>Make Design Public</label>
                        <input
                            className="register-input"
                            type="checkbox"
                            // id="designImage"
                            onChange={e => props.onChange(e.target.checked)}
                        />
                        </>
                    } // props contains: onChange, onBlur and value
                />
                <input type="submit" />
            </form>
        </>
    )
}