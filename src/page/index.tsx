import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom"

import Header from '@elements/Header'
import Icon from '@elements/Icon'

import FeedPage from "./user/feed"
import AlbumDisplayPage from "./user/albumDispaly";

export default () => {
    const navegate = useNavigate();
        
    return (
        <>
            <Header>
                <Header.Chunk id="header-chunck-left">
                    <Icon onClick={() => navegate("/") } icon="home" canHover={true}/>
                </Header.Chunk>
                <Header.Chunk id="header-chunck-center" isMaxed={true}>
                    
                </Header.Chunk>
                <Header.Chunk id="header-chunck-right">
                    <Icon icon="account" canHover={true}/>
                    <Icon onClick={() => navegate("/dashboard") } icon="view-dashboard" canHover={true}/>
                </Header.Chunk>
            </Header>
            <div id="content">
                <Routes>
                    { /* TODO: Find out why regex nor string[] is workign on paths */ }
                    <Route path={"/"} element={<FeedPage />}/>
                    <Route path={"/album/:id"} element={<AlbumDisplayPage />}/>
                </Routes>
            </div>
        </>
    );
}