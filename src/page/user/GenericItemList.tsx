import React, { useEffect, useState } from "react";

import NotificationManager from "@global/NotificationManager";
import RestWraper from "@global/RestWraper"
import ItemList from "@modules/elements/ItemList/intex";

export interface IGenericItemListProps<T> {
    title: string
    restName: string
    restTarget: string
    imageRestName: string
    onClick: (selected: T) => void
}

const GenericItemList = <T extends { id: number, name: string }>(props: IGenericItemListProps<T>) => {
    const [ Items, setItems ] = useState<T[]>([])

    var restFeed = new RestWraper<T>(props.restName)
    var restAlbum = new RestWraper<T>(props.imageRestName)

    useEffect(() => {
        restFeed.GetAll({
            custom: `/${props.restTarget}`,
            onSuccess: (Data) => setItems(Data),
            onError: () => NotificationManager.Create("Error", "Error Getting List", 'danger')
        })
    }, [])
    
    return (
        <>
            <ItemList title={props.title}>
                { Items.map((v, i) => <ItemList.Item onClick={() => props.onClick(v)} title={v.name} icon="play" iconSize={50} image={restAlbum.GetImage(v.id)} key={i}/>)}
            </ItemList>
        </>
    );
}

export default GenericItemList