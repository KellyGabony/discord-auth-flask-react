import {useEffect} from "react";
import request from "axios";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
function Login() {
    let [cookie] = useCookies('x-access-token')
    cookie = cookie["x-access-token"]
    const redirect_url = "https://discord.com/api/oauth2/authorize?client_id=939450576595451916&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Flogin&response_type=code&scope=identify%20email%20guilds%20guilds.join"
    const navigate = useNavigate();
    useEffect(()=>{
        if (typeof cookie !== "undefined"){navigate('/home')}
    })
    return (
        <div className="login">
            <button onClick={()=>window.location.href=redirect_url} className="login-button" >Login</button>
        </div>
    )
}
export default Login;
