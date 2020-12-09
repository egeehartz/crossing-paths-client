import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"

export const Register = (props) => {

    const [profileImg, setProfileImg] = useState('')

    const getBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(file);
    }

    const createProfileImageJSON = (event) => {
        getBase64(event.target.files[0], (base64ImageString) => {
            setProfileImg(base64ImageString)
        });
    }

    const firstName = useRef()
    const lastName = useRef()
    const email = useRef()
    const userName = useRef()
    const password = useRef()
    const verifyPassword = useRef()
    const passwordDialog = useRef()


    const handleRegister = (e) => {
        e.preventDefault()
        if (password.current.value === verifyPassword.current.value) {
            const newUser = {
                "first_name": firstName.current.value,
                "last_name": lastName.current.value,
                "username": userName.current.value,
                "email" : email.current.value,
                "password": password.current.value,
                "profile_img": profileImg
            }
            return fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(newUser) //adds new user to the db
            })
                .then(res => res.json())
                .then(res => {
                        localStorage.setItem("cp_user", res.token)
                        props.history.push("/") //redirects to home page
                })
        } else {
            passwordDialog.current.showModal()
        }
    }

    return (
        <main style={{ textAlign: "center" }}>

            <dialog className="dialog dialog--password" ref={passwordDialog}>
                <div>Passwords do not match</div>
                <button className="button--close" onClick={e => passwordDialog.current.close()}>Close</button>
            </dialog>
            <form className="form--login" onSubmit={handleRegister}>
                <h1 className="h3 mb-3 font-weight-normal">Register an account</h1>
                <fieldset>
                    <label htmlFor="firstName"> First Name </label>
                    <input ref={firstName} type="text" name="firstName" className="form-control" placeholder="first name" />
                </fieldset>
                <fieldset>
                    <label htmlFor="lastName"> Last Name </label>
                    <input ref={lastName} type="text" name="lastName" className="form-control" placeholder="last name" />
                </fieldset>
                <fieldset>
                    <label htmlFor="userName"> Username </label>
                    <input ref={userName} type="text" name="userName" className="form-control" placeholder="display name" />
                </fieldset>
                <fieldset>
                    <label htmlFor="inputEmail"> Email Address</label>
                    <input ref={email} type="email" name="email" className="form-control" placeholder="email address" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="profile_image_url"> Profile Image </label>
                    <input className="register-input" type="file" id="profile_image" onChange={(evt) => {createProfileImageJSON(evt)}}/>
                </fieldset>
                <fieldset>
                    <label htmlFor="inputPassword"> Password </label>
                    <input ref={password} type="password" name="password" className="form-control" placeholder="password" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="verifyPassword"> Verify Password </label>
                    <input ref={verifyPassword} type="password" name="verifyPassword" className="form-control" placeholder="re-enter password" required />
                </fieldset>
                <fieldset>
                    <button className="btn btn-1 btn-sep icon-send" type="submit">Register</button>
                </fieldset>
            </form>
            <section className="link--register">
                <div>Already Registered?</div>
                <Link to="/login">Login</Link>
            </section>
        </main>
    )
}