import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FollowingsContext } from "./FriendProvider"
import { UserContext } from "./UserProvider"
import defaultImg from "./images/default.png"




export const FriendList = () => {
    const {getCurrentUser, getUsers, users, getUsersToFollow} = useContext(UserContext)
    const {getFriendsByFollower} = useContext(FollowingsContext)

    const [friends, setFriends] = useState([])
    const [potentialFriends, setPotentialFriends] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = event => {
        const userInput = event.target.value.toLowerCase()
        setSearchTerm(userInput);
      };

    useEffect(() => {
        if (searchTerm !== "") {
            const results = potentialFriends.filter(u =>
                u.user.username.toLowerCase().includes(searchTerm)
            )
        
            setSearchResults(results);
        }
    }, [searchTerm])
    
    
    useEffect(() => {
        getUsers()
        getCurrentUser()
        .then(user => {
            getFriendsByFollower(user.id)
            .then(setFriends)
        })
        .then(() => {
            getUsersToFollow().then(setPotentialFriends)
        })
    },[])


    return (
        <>
            <h1>Friends</h1>
            <div>
            {
                friends.map(f => {
                    return <div>
                        {f.friend.profile_img === null || f.friend.profile_img === undefined
                    ? <img src={defaultImg} width='50px' alt="profile" />
                    : <img src={f.friend.profile_img} width='50px' alt="profile" />
                }
                        <Link to={{ pathname: `/profile/${f.friend.id}`, state:{friendObj: f} }}>
                        {f.friend.full_name}
                        </Link>
                        </div>
                })
            }
            </div>
            <div>
                <h2>Find Friends!</h2>
                <input type="text" value={searchTerm} onChange={handleChange} placeholder="search by username" />
                <ul>
                    { searchTerm !== "" ?
                        searchResults.map(result => {
                            return <> <li>{result.user.username}</li> <button>follow</button> </>
                        }) : ""
                    }
                </ul>
            </div>
        </>
    )
}