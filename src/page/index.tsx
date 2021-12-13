import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom"

import FeedPage from "./user/feed"
import AlbumDisplayPage from "./user/albumDispaly";
import MusicPlayer from "@elements/MusicPlayer";

import musicContext, { defaultMusicContex } from "@context/MusicContext";
import { IMusic } from "@interface/database";
import RestWraper from "@global/RestWraper";
import userContext from "@context/AuthContext";

import './scss/index.scss'
import Cookies from "js-cookie";
import PageHeader from "./pageHeader";

export default () => {
    var restMusic = new RestWraper<IMusic>("music")
    const [ music, setMusic ] = useState<IMusic>(defaultMusicContex.music)
    const { token } = useContext(userContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (token.isLoaded && token.token == "")
            navigate("/auth")
    }, [token])

    return (
        <>
            <PageHeader/>
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