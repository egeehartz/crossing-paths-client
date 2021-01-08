import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {Button} from "reactstrap"
import { FollowingsContext } from "./FriendProvider"
import { UserContext } from "./UserProvider"
import defaultImg from "./images/default.png"
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import "./FriendList.css"




export const FriendList = () => {
    const { getCurrentUser, getUsers, getUsersToFollow } = useContext(UserContext)
    const { getFriendsByFollower, createFollowing, deleteFollowing } = useContext(FollowingsContext)

    const [friends, setFriends] = useState([])
    const [potentialFriends, setPotentialFriends] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [friendsManage, setManage] = useState(true);
    const toggle = () => {friendsManage ? setManage(false) : setManage(true)}
    const [followAction, setFollowAction] = useState(true);
    const toggleFollow = () => {followAction ? setFollowAction(false) : setFollowAction(true)}

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
    }, [followAction])


    return (
        <>
            <h1 className="friendTitle">Friends</h1>
            <div className="manageButton">
            <Button color="info" size="sm" onClick={toggle}>
                {friendsManage ? 'manage' : 'nevermind'}
            </Button>
            </div>
            <div className="friendsDiv">
                {
                    friends.map(f => {
                        return <div className="friend">
                            {friendsManage ?
                             "" : 
                             <Button size="sm" color="info" onClick={() => {
                                 deleteFollowing(f.id)
                                    .then(toggleFollow)
                             }
                            }><HighlightOffIcon /></Button>
                            }
                            {f.friend.profile_img === null || f.friend.profile_img === undefined
                                ? <img src={defaultImg}  alt="profile" />
                                : <img src={f.friend.profile_img}  alt="profile" />
                            }
                            <div className="friendText">
                            <Link to={{ pathname: `/profile/${f.friend.id}`, state: { friendObj: f } }}>
                                {f.friend.full_name}
                            </Link>
                            <p>{f.friend.username}</p>
                            </div>
                        </div>
                    })
                }
            </div>
            <div>
                <h2 className="friendTitle">Find Friends!</h2>
                <input className="friendSearch" type="text" value={searchTerm} onChange={handleChange} placeholder="search by username" />
                <ul className="potentialFriends">
                    {searchTerm !== "" ?
                        searchResults.map(result => {
                            return <> <div className="followFriend">
                                <li>{result.user.username}</li>
                                <Button size="sm" onClick={() => {
                                    createFollowing({
                                        friendId: result.id
                                    })
                                        .then(() =>
                                            getCurrentUser()
                                            .then((user) => {
                                                getFriendsByFollower(user.id)
                                                    .then(setFriends)
                                                    .then(setSearchTerm(""))
                                                    .then(toggleFollow)
                                            }))
                                }}>follow</Button> 
                                </div>
                                </>
                        }) : ""
                    }
                </ul>
            </div>
        </>
    )
}