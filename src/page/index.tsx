import React, { useContext, useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"

import FeedPage from "./user/feed"
import AlbumDisplayPage from "./user/albumDispaly"
import MusicPlayer, { MusicPlayerHandle } from "@elements/MusicPlayer"

import musicContext, { defaultMusicContex } from "@context/MusicContext"
import { IMusic } from "@interface/database"
import RestWraper from "@global/RestWraper"
import userContext from "@context/AuthContext"
import PageHeader from "./pageHeader"
import PlaylistPage from "./user/playlist"

import './scss/index.scss'

export default () => {
    var restMusic = new RestWraper<IMusic>("music")
    const [ music, setMusic ] = useState<IMusic[]>(defaultMusicContex.music)
    const { token } = useContext(userContext)
    const navigate = useNavigate()

    const musicFile = React.createRef<MusicPlayerHandle>() 

    useEffect(() => {
        if (token.isLoaded && !token.token)
            navigate("/auth")
    }, [token])

    useEffect(() => {
        if (musicFile.current)
            musicFile.current.setMusic(music.map((v) => restMusic.GetFile(v.id, 'music')))
    }, [music])

    return (
        <>
            <PageHeader/>
            <musicContext.Provider value={{music: music, setMusic: (music) => { setMusic(music) }}}>
                <div id="content">
                    <Routes>
                        { /* TODO: Find out why regex nor string[] is workign on paths */ }
                        <Route path={"/"} element={<FeedPage />} />
                        <Route path={"/album/:id"} element={<AlbumDisplayPage />}/>
                        <Route path={"/playlist/:id"} element={<PlaylistPage />}/>
                    </Routes>
                </div>
                <MusicPlayer ref={musicFile} canUpload={false} id="global-music-player"/>
            </musicContext.Provider>
        </>
    );
}