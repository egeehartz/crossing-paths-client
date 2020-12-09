import React, { useRef } from "react";
import { Link, useHistory } from "react-router-dom";


export const Login = (props) => {
  const user = useRef();
  const password = useRef();
  const invalidDialog = useRef();
  const history = useHistory();

  const handleLogin = (e) => {
    e.preventDefault();

    return fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: user.current.value,
        password: password.current.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.valid) {
          localStorage.setItem("cp_user", res.token)
          props.history.push("/");
        } else {
          invalidDialog.current.showModal();
        }
      });
  };

    return (
        <main className="container--login">
            <dialog className="dialog dialog--auth" ref={invalidDialog}>
                <div>Email or password was not valid.</div>
                <button className="button--close" onClick={e => invalidDialog.current.close()}>Close</button>
            </dialog>
            <section>
                <form className="form--login" onSubmit={handleLogin}>
                    <h1>Rare</h1>
                    <h2>Sign In</h2>
                    <fieldset>
                        <label htmlFor="inputUser"> Username: </label>
                        <input ref={user} type="text" id="userName" className="form-control" placeholder="username" required autoFocus />
                    </fieldset>
                    <fieldset>
                        <label htmlFor="inputPassword"> Password: </label>
                        <input ref={password} type="password" id="password" className="form-control" placeholder="password" required />
                    </fieldset>
                    <fieldset>
                        <button className="btn btn-1 btn-sep icon-send" type="submit">Sign In</button>
                    </fieldset>
                </form>
            </section>
            <section className="link--register">
                <div>Not a member yet?</div>
                <Link to="/register">Register Here</Link> 
            </section>
        </main>
    )
}