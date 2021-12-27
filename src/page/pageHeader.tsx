import React, { useContext } from "react"
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

import Header from "@elements/Header"
import Icon from "@elements/Icon"
import userContext from "@context/AuthContext";

const PageHeader = () => {
    const navegate = useNavigate();
    const { user, setToken } = useContext(userContext)

    const Logout = () => {
        Cookies.set('auth', undefined)
        setToken({ token: undefined, isLoaded: true })
        navegate("/auth")
    }

    return (
        <Header>
            <Header.Chunk id="header-chunck-left">
                <Icon onClick={() => navegate("/") } icon="home" canHover={true}/>
            </Header.Chunk>
            <Header.Chunk id="header-chunck-center" isMaxed={true}>
                
            </Header.Chunk>
            <Header.Chunk id="header-chunck-right">
                <Icon icon="account" canHover={true}/>
                { user.isAdmin ? <Icon onClick={() => navegate("/dashboard") } icon="view-dashboard" canHover={true}/> : <></> }
                <Icon onClick={Logout} icon="logout" canHover={true}/>
            </Header.Chunk>
        </Header>
    )
}

export default PageHeader