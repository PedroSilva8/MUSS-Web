import React, { useContext, useEffect } from "react";

import { IMusic } from "@interface/database";
import RestWraper from "@global/RestWraper";
import NotificationManager from "@modules/global/NotificationManager";

export interface IMusicTableProps {
    albumId: number
}

export interface IMusicTableState {
    musics: IMusic[]
}

import './music_table.scss'
import musicContext from "@context/MusicContext";

const MusicTable = (props: IMusicTableProps) => {

    const { setMusic } = React.useContext(musicContext)
    const [ state, setState ] = React.useState<IMusicTableState>({ musics: [] })

    var restMusic = new RestWraper<IMusic>("music")

    useEffect(() => {
        restMusic.GetWhere({
            arguments: {
                album_id: props.albumId.toString()
            },
            onSuccess: (musicsData) => setState({ musics: musicsData }),
            onError: () => NotificationManager.Create('Error', "Failed To Get Algum", 'danger')
        })
    }, [])

    return (
        <div className="music-table">
            <div className="music-table-header">
                <span>#</span>
                <span className="music-table-grow">TITLE</span>
                <span>TIME</span>
            </div>
            <div className="music-table-rows">
                { state.musics.map((val, i) => <div onClick={() => setMusic(val)} className="music-table-row">
                    <span>{ i + 1 }</span>
                    <span className="music-table-grow">{ val.name }</span>
                    <span>{ val.length }</span>
                </div>) }
            </div>
        </div>
    );
}

MusicTable.defaultProps = {
};

export default MusicTable