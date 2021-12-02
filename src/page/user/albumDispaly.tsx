import React, { useEffect } from "react";

import { IAlbum } from "@interface/database"

import RestWraper from "@global/RestWraper";
import NotificationManager from "@global/NotificationManager";

import { useParams } from "react-router";

import './scss/albumDisplay.scss'

const AlbumDisplayPage = () => {
    const [ album, setAlbum ] = React.useState<IAlbum>({ id: -1, artist_id: -1, name: "", description: "" })
    const { id } = useParams()

    var restAlbum = new RestWraper<IAlbum>("album")

    useEffect(() => {
        restAlbum.Get({
            index: parseInt(id),
            onSuccess: (album) => setAlbum(album),
            onError: () => NotificationManager.Create("Error", "Error Getting Album", 'danger')
        })    
    }, [])

    return (
        <div id="album-display">
            <div id="album-display-header">
                <img src={ restAlbum.GetImage(parseInt(id)) }/>
                <div id="album-display-name">
                    <h2>{album.name}</h2>
                </div>
            </div>
            <div id="album-display-content">

            </div>
        </div>
    )
}

export default AlbumDisplayPage