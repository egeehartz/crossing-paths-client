import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useForm, Controller } from "react-hook-form";
import { CategoryContext } from "./CategoryProvider";
import { DesignContext } from "./DesignProvider";
import "./DesignForm.css"



export const DesignForm = () => {
    const { categories, getCategories } = useContext(CategoryContext)
    const {addDesign, getDesignById, updateDesign} = useContext(DesignContext)
    const history = useHistory()
    
    const { handleSubmit, control } = useForm();
    
    const params = useParams()
    const editMode = params.hasOwnProperty("designId")

    const [designObj, setDesignObj] = useState({
                                                title: "",
                                                link: "",
                                                category_id: 0,
                                                design_img: null,
                                                public: false
                                                        })


    useEffect(() => {
        if (editMode) {
            const designId = parseInt(params.designId)
            getCategories()
            getDesignById(designId)
            .then(setDesignObj)
        } else {
            getCategories()
        }
    },[])


    const refactorOnChange = (e) => {
        const newDesign = Object.assign({}, designObj)  
        if(e.target.name === "public") {
            newDesign[e.target.name] = e.target.checked 
        }   else {
            newDesign[e.target.name] = e.target.value  
        }     
        setDesignObj(newDesign) 
    }

    const onSubmit = data => {    
        if (editMode) {
            if(designImg !== '') {
                const completeObj = addImageToData(designObj, designImg)
                updateDesign(completeObj)
                .then(() => {
                    history.push('/homepage')
                })
            } else {
                updateDesign(designObj)
                .then(() => {
                    history.push('/homepage')
                })
            }
        } else {
            const completeObj = addImageToData(designObj, designImg)
            addDesign(completeObj)
            .then(() => {
                history.push('/homepage')
        })
        }
    } 

    const addImageToData = (dataObj, stateVar) => {
        dataObj.design_img = stateVar
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
            {editMode ? <h1>Edit Design</h1> : <h1>Add a New Design!</h1>}
            <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller name="title" 
                                control={control} 
                                defaultValue={designObj.title} 
                                render={props =>
                                    <>
                                    <label className="publicLabel">Design Name</label>
                                    <input
                                        className="register-input"
                                        defaultValue={designObj.title}
                                        type="text"
                                        name="title"
                                        onChange={e => {
                                            refactorOnChange(e)}}
                                    />
                                    </> 
                                }/>
                    <Controller name="link" 
                                control={control} 
                                defaultValue={designObj.link} 
                                render={props =>
                                    <>
                                    <label className="publicLabel">Design Link</label>
                                    <input
                                        className="register-input"
                                        name="link" 
                                        defaultValue={designObj.link} 
                                        type="text"
                                        onChange={e => {
                                            refactorOnChange(e)}}
                                    />
                                    </> 
                                }/>

                    <Controller name="categoryId" 
                                control={control} 
                                defaultValue={designObj.category_id} 
                                render={props =>
                                    <>
                                    <label>Design Progress:</label>
                                    <select name="category_id" onChange={e => {
                                            refactorOnChange(e)}} 
                                            className="designInput"
                                            defaultValue={designObj.category_id} >
                                        <option value="0">Select a Category</option>
                                        {
                                            categories.map(c => <option value={c.id}>{c.label}</option>)
                                        }

                                    </select>
                                    </> 
                                }/>
                <Controller
                    name="design_img"
                    control={control}
                    defaultValue={designObj.design_img}
                    rules={{ required: false }}
                    render={props =>
                        <>
                        {editMode ? 
                        <>
                        <label>Image Chosen:</label>
                        <img src={designObj.design_img} width="150px" /> 
                        <label>Change Image:</label>
                        </>
                        : <label>Image:</label>}
                        <input
                        defaultValue={designObj.design_img}
                        className="designInput chooseFile"
                            type="file"
                            name="design_img"
                            // id="designImage"
                            onChange={e => createProfileImageJSON(e)}
                        />
                        </>
                    }
                />
                <Controller
                    className="designInput"
                    name="public"
                    control={control}
                    defaultValue={designObj.public}
                    rules={{ required: false }}
                    render={props =>
                        <>
                        <div className="checkbox-public">
                      
                        <label className="publicLabel">Make Design Public</label>
                        <input
                            // defaultValue={designObj.public}
                            className="register-input"
                            type="checkbox"
                            name="public"
                            checked= {designObj.public}
                            onChange={e => {
                                refactorOnChange(e)}}
                        />
                        </div>
                        </>
                    }
                />



                <input className="submitButton" type="submit" />
            </form>
        </>
    )
}