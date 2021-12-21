import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router'

import { IAlbum, IPlaylist } from "@interface/database"

import NotificationManager from "@global/NotificationManager";
import RestWraper from "@global/RestWraper"
import ItemList from "@modules/elements/ItemList/intex";
import GenericItemList from "./GenericItemList";
import userContext from "@context/AuthContext";

const FeedPage = () => {
    const { token, user } = useContext(userContext)
    var navigate = useNavigate()
    
    var rest = new RestWraper<IPlaylist>("playlist")

    if (!token.isLoaded || !user.id)
        return (<></>)

    const onCreate = () => {
        rest.Create({
            token: token.token,
            onSuccess: (Data) => navigate("/playlist/" + Data.id),
            onError: () => { }
        })
    }

    return (
        <div id="feedPage">
            <GenericItemList<IPlaylist> onCreate={onCreate} canCreate={true} title="Your Playlists" imageRestName="playlist" restName="playlist" arguments={{token: token.token}} restTarget="" onClick={(v) => navigate("/playlist/" + v.id)}/>
            <GenericItemList<IAlbum> title="Latest Albums" imageRestName="album" restName="feed" restTarget="/latest" onClick={(v) => navigate("/album/" + v.id)}/>
        </div>
    );
}

export default FeedPage