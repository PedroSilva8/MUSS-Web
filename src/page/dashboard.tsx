import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom'

import TreeView from '@elements/TreeView'

import userContext from "@context/AuthContext";

import ArtistPage from "./dashboard/artist"
import AlbumPage from "./dashboard/album"
import MusicPage from "./dashboard/music"
import UsersPage from "./dashboard/users";
import PageHeader from "./pageHeader";

export default () => {
    const navegate = useNavigate();
    const { token, user } = useContext(userContext)
    
    useEffect(() => {
        if (token.isLoaded && token.token == "")
            navegate("/auth")
    }, [token])

    useEffect(() => {
        if (token.isLoaded && !user.isAdmin)
            navegate("/")
    }, [user])

    return (
        <>
            <PageHeader/>
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