import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router'

import { IAlbum } from "@interface/database"

import NotificationManager from "@global/NotificationManager";
import RestWraper from "@global/RestWraper"
import ItemList from "@modules/elements/ItemList/intex";
import GenericItemList from "./GenericItemList";

const FeedPage = () => {
    var navigate = useNavigate()

    return (
        <div id="feedPage">
            <GenericItemList<IAlbum> title="Your Playlists" imageRestName="album" restName="feed" restTarget="latest" onClick={(v) => navigate("/album/" + v.id)}/>
            <GenericItemList<IAlbum> title="Latest Albums" imageRestName="album" restName="feed" restTarget="latest" onClick={(v) => navigate("/album/" + v.id)}/>
        </div>
    );
}

export default FeedPage