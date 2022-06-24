import React, {useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import {useCookies} from "react-cookie";
import './nav.css'
function Nav () {
    const [user,setUser] = useState({avatar:"https://acegif.com/wp-content/uploads/loading-64.gif",username:""})
    let [profile,setProfile] = useState("none")
    let [logout,setLogout] = useState(null)
    const [load,setLoad] = useState(false)
    const [menu, setMenu] = useState("none");
    const [auth,setAuth,removeAuth] = useCookies(["x-access-token"])
    const navigate = useNavigate();
    useEffect(()=> {
        if (!load) {
            if (typeof auth["x-access-token"] === "undefined") {
                navigate("/login")
            }
            fetch("http://localhost:5000/user", {
                "headers": {
                    "accept": "*/*",
                },
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }).then(res => res.json()).then(res => {
                if (res.status === "success") {
                    setUser(res)
                } else {
                    removeAuth("x-access-token")
                    navigate("/login")
                }
            });
            setLoad(true)
        }
    },[auth])
        return (
            <section className="top-nav">
                <div className="logo">
                    <img src = "https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?k=20&m=1300845620&s=612x612&w=0&h=f4XTZDAv7NPuZbG0habSpU0sNgECM0X7nbKzTUta3n8=" className="avatar"/>
                </div>
                <div className="user">
                    <div onMouseLeave = {() => {setMenu(menu === "none" ? "block" : "none");}} onMouseEnter={() => {setMenu(menu === "none" ? "block" : "none");}} className="user-button">
                        <img src = {user.avatar} className="avatar"/>
                        <span>{user.username}</span>
                        <div className="user-menu" style={{display:menu}}>
                            <Link to="/profile" onMouseLeave = {() => {setProfile("none");}} onMouseEnter={() => {setProfile("gray");}} style={{background:profile}} className = "punct-up">Profile</Link>
                            <Link to="/login" onMouseLeave = {() => {setLogout("none");}} onMouseEnter={() => {setLogout("gray");}} style={{background:logout}} onClick={()=>{removeAuth("x-access-token")}} className = "punct-down" >Logout</Link>
                        </div>
                    </div>
                </div>
            </section>
        );
}

export default Nav;