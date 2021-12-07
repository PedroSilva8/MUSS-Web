import React, { useContext } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom'

import Header from '@elements/Header'
import Icon from '@elements/Icon'
import TreeView from '@elements/TreeView'

import ArtistPage from "./dashboard/artist"
import AlbumPage from "./dashboard/album"
import MusicPage from "./dashboard/music"
import UsersPage from "./dashboard/users";
import userContext from "@context/AuthContext";

export default () => {
    const navegate = useNavigate();
    const { token } = useContext(userContext)
    
    if (token == "")
        navegate("/auth")

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
                    <Icon icon="view-dashboard" canHover={true}/>
                </Header.Chunk>
            </Header>
            <div id="content">
                <TreeView>
                    <TreeView.Header title="Library">
                        <TreeView.Header.Option icon="account-music" onClick={() => navegate("/dashboard/artist") } content="Artists"/>
                        <TreeView.Header.Option icon="album" onClick={() => navegate("/dashboard/album") } content="Album"/>
                        <TreeView.Header.Option icon="music-note" onClick={() => navegate("/dashboard/music") } content="Music"/>
                    </TreeView.Header>
                    <TreeView.Header title="Settings">
                        <TreeView.Header.Option icon="account" onClick={() => navegate("/dashboard/users") } content="Users"/>
                        <TreeView.Header.Option icon="cog-outline" content="General"/>
                    </TreeView.Header>
                </TreeView>
                <Routes>
                    { /* TODO: Find out why regex nor string[] is workign on paths */ }
                    <Route path={"/"} element={<ArtistPage />}/>
                    <Route path={"/artist/*"} element={<ArtistPage />}/>
                    <Route path={"/album/*"} element={<AlbumPage />}/>
                    <Route path={"/music/*"} element={<MusicPage />}/>
                    <Route path={"/users/*"} element={<UsersPage />}/>
                </Routes>
            </div>
        </>
    );
}