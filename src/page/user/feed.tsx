import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router'

import { IAlbum } from "@interface/database"

import NotificationManager from "@global/NotificationManager";
import RestWraper from "@global/RestWraper"
import ItemList from "@modules/elements/ItemList/intex";

const FeedPage = () => {
    const [ latestAlbums, setlatestAlbums ] = useState<IAlbum[]>([])

    var navigate = useNavigate()

    var restFeed = new RestWraper<IAlbum>("feed")
    var restAlbum = new RestWraper<IAlbum>("album")

    useEffect(() => {
        restFeed.GetAll({
            custom: "/latest",
            onSuccess: (Data) => setlatestAlbums(Data),
            onError: () => NotificationManager.Create("Error", "Error Getting Artists", 'danger')
        })
    }, [])

    return (
        <>
            <ItemList title="Latest Albums">
                { latestAlbums.map((v, i) => <ItemList.Item onClick={() => navigate('/album/' + v.id)} title={v.name} icon="play" iconSize={50} image={restAlbum.GetImage(v.id)} key={i}/>)}
            </ItemList>
        </>
    );
}

export default FeedPage