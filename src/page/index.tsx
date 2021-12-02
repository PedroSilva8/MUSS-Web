import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom"

import Header from '@elements/Header'
import Icon from '@elements/Icon'

import FeedPage from "./user/feed"
import AlbumDisplayPage from "./user/albumDispaly";
import MusicPlayer from "@elements/MusicPlayer";

import './scss/index.scss'
import musicContext, { defaultMusicContex } from "@context/MusicContext";
import { IMusic, IMusicContext } from "@interface/database";
import RestWraper from "@modules/global/RestWraper";



export default () => {
    const navegate = useNavigate();
    var restMusic = new RestWraper<IMusic>("music")
    const [ music, setMusic ] = useState<IMusic>(defaultMusicContex.music)

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
            <musicContext.Provider value={{music: music, setMusic: (music) => { setMusic(music) }}}>
                <div id="content">
                    <Routes>
                        { /* TODO: Find out why regex nor string[] is workign on paths */ }
                        <Route path={"/"} element={<FeedPage />} />
                        <Route path={"/album/:id"} element={<AlbumDisplayPage />}/>
                    </Routes>
                </div>
                <MusicPlayer src={restMusic.GetFile(music.id, "music")} id="global-music-player"/>
            </musicContext.Provider>
        </>
    );
}