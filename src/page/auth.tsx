import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { sha256 } from "js-sha256";

import userContext from "@context/AuthContext";

import Input from "@elements/Input";
import Button from "@elements/Button";

import RestHelper from "@global/RestHelper";

import './scss/auth.scss'
import Cookies from "js-cookie";

interface IAuthState {
    mode: 'login' | 'register'
}

export default () => {
    const [state, setState] = useState<IAuthState>({
        mode: 'login'
    }) 

    const { token, setToken, user, setUser } = useContext(userContext)
    const navigate = useNavigate()
    
    /* Check If Logged */
    useEffect(() => {
        if (token.isLoaded && token.token != "")
            navigate("/")
    }, [])

    const Login = () => {
        RestHelper.GetItems({
            target: "user/login",
            arguments: {
                name: user.name,
                password: sha256(user.password)
            },
            onSuccess: (Data) => {
                if (Data.data) {
                    Cookies.set('auth', Data.data)
                    setToken(Data.data)
                    navigate("/")
                }
            },
            onError: () => {}
        })
    }

    return (
        <>
            <div className="login-page">
                <div className="login-page-box">
                    <div className="login-page-header">
                        <span>LOGIN</span>
                    </div>
                    <div className="login-page-content">
                        <Input onChange={(v) => setUser({...user, name: v})} value={user.name} direction="column" label="Name"/>
                        <Input type="password" onChange={(v) => setUser({...user, password: v})} value={user.password} direction="column" label="Password"/>
                        <Button onClick={Login} text="Login"/>
                    </div>
                </div>
            </div>
        </>
    );
}