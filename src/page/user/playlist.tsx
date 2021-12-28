import React, { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router"

import { defaultPlaylist, IPlaylist } from "@interface/database"
import RestWraper from "@global/RestWraper"
import NotificationManager from "@global/NotificationManager"
import MusicTable, { MusicTableHandle } from "@customElements/music_table"
import userContext from "@context/AuthContext"
import musicContext from "@context/MusicContext"
import Icon from "@elements/Icon"

import './scss/playlistDisplay.scss'

const PlaylistPage = () => {
    const { user, token } = React.useContext(userContext)
    const { setMusic } = React.useContext(musicContext)
    const [ playlist, setPlaylist ] = React.useState<IPlaylist>(defaultPlaylist)
    const Title = React.useRef<HTMLHeadingElement>()
    const { id } = useParams()

    const navigate = useNavigate()

    var restAlbum = new RestWraper<IPlaylist>("playlist")

    useEffect(() => {
        if (token.isLoaded)
            restAlbum.Get({
                token: token.token,
                index: parseInt(id),
                onSuccess: (playlist) => setPlaylist(playlist),
                onError: () => NotificationManager.Create("Error", "Error Getting Playlist", 'danger')
            })    
    }, [token.isLoaded])

    const onDblClickTitle = () => {
        if (user.id != playlist.userId)
            return

        Title.current.setAttribute("contenteditable", "true")
        Title.current.focus()
    }

    const onTitleLoseFocus = () => {
        Title.current.setAttribute("contenteditable", "false")
        restAlbum.Update({
            index: playlist.id,
            token: token.token,
            data: {
                id: undefined,
                userId: undefined,
                description: undefined,
                name: Title.current.innerText,
            },
            onSuccess: () => NotificationManager.Create("Success", "Successfully Updated Title", 'success'),
            onError: () => NotificationManager.Create("Error", "Error Failed Updating Title", 'danger')
        })
    }

    const onKeyDownTitle = (event: React.KeyboardEvent) => {
        if (event.key == 'Enter') {
            Title.current.blur()
            return false
        }
    }

    const onDelete = () => {
        restAlbum.Delete({
            index: playlist.id,
            token: token.token,
            onSuccess: () => {
                NotificationManager.Create("Success", "Successfully Deleted Playlist", 'success')
                navigate("/")
            },
            onError: () => NotificationManager.Create("Error", "Error Failed Deleting Playlist", 'danger')
        })
    }

    const musicRef = useRef<MusicTableHandle>()

    const onPlayAll = () => {
        if (musicRef.current)
            setMusic(musicRef.current.getMusics())
    }   

    return (
        <div id="playlist-display">
            <div id="playlist-display-header">
                <img src={ restAlbum.GetImage(parseInt(id)) }/>
                <div id="playlist-display-name">
                    <h2 ref={Title} onDoubleClick={onDblClickTitle} onKeyDown={onKeyDownTitle} onBlur={onTitleLoseFocus}>{playlist.name}</h2>
                </div>
            </div>
            <div id="playlist-display-mid">
                <Icon canHover={true} onClick={onPlayAll} icon="play"/>
                <Icon canHover={true} onClick={onDelete} icon="delete"/>
            </div>
            <div id="playlist-display-content">
                <MusicTable ref={musicRef} target="music" arguments={{ playlist_id: id }}/>
            </div>
        </div>
    )
}

export default PlaylistPage