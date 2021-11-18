import React from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';

import Header from '@elements/Header'
import Icon from '@elements/Icon'
import TreeView from '@elements/TreeView'

import ArtistPage from "./dashboard/artist";
import AlbumPage from "./dashboard/album";

export default () => {
    const navegate = useNavigate();
    
    return (
        <>
            <Header>
                <Header.Chunk id="header-chunck-left">
                    
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
                        <TreeView.Header.Option icon="account-music" onClick={() => { navegate("/dashboard/artist") }} content="Artists"/>
                        <TreeView.Header.Option icon="album" onClick={() => { navegate("/dashboard/album") }} content="Album"/>
                    </TreeView.Header>
                    <TreeView.Header title="Settings">
                        <TreeView.Header.Option icon="account" content="Users"/>
                        <TreeView.Header.Option icon="cog-outline" content="General"/>
                    </TreeView.Header>
                </TreeView>
                <Routes>
                    { /* TODO: Find out why regex nor string[] is workign on paths */ }
                    <Route path={"/"} element={<ArtistPage />}/>
                    <Route path={"/artist/*"} element={<ArtistPage />}/>
                    <Route path={"/album/*"} element={<AlbumPage />}/>
                </Routes>
            </div>
        </>
    );
}