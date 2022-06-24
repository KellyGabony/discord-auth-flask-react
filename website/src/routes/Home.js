import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import Nav from "./components/Nav";
import "./home.css"
function Home() {
    return (
        <div>
            <Nav/>
            <div className="content">
                <div className="welcome">
                    We're happy to welcome you in LMK DAO!
                </div>
            </div>
        </div>


    )
}
export default Home;
