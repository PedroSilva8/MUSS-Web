import React, { useEffect } from "react"
import { useParams } from "react-router"

import { defaultPlaylist, IPlaylist } from "@interface/database"
import RestWraper from "@global/RestWraper"
import NotificationManager from "@global/NotificationManager"
import MusicTable from "@customElements/music_table"

import './scss/playlistDisplay.scss'
import userContext from "@context/AuthContext"

const PlaylistPage = () => {
    const [ playlist, setPlaylist ] = React.useState<IPlaylist>(defaultPlaylist)
    const { token } = React.useContext(userContext)
    const { id } = useParams()

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

    return (
        <div id="playlist-display">
            <div id="playlist-display-header">
                <img src={ restAlbum.GetImage(parseInt(id)) }/>
                <div id="playlist-display-name">
                    <h2>{playlist.name}</h2>
                </div>
            </div>
            <div id="playlist-display-content">
                <MusicTable target="music" arguments={{ playlist_id: id }}/>
            </div>
        </div>
    )
}

export default PlaylistPage