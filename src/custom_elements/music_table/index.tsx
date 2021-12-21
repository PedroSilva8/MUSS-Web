import React, { useEffect } from "react"

import { IMusic } from "@interface/database"
import RestWraper from "@global/RestWraper"
import NotificationManager from "@global/NotificationManager"
import musicContext from "@context/MusicContext"

import './music_table.scss'
import userContext from "@context/AuthContext"

export interface IMusicTableProps {
    target: string
    arguments: { [key: string]: string; }
}

export interface IMusicTableState {
    musics: IMusic[]
}

const MusicTable = (props: IMusicTableProps) => {

    const { setMusic } = React.useContext(musicContext)
    const [ state, setState ] = React.useState<IMusicTableState>({ musics: [] })
    const { token } = React.useContext(userContext)

    var restMusic = new RestWraper<IMusic>(props.target)

    useEffect(() => {
        if (token.isLoaded)
            restMusic.GetWhere({
                token: token.token,
                arguments: props.arguments,
                onSuccess: (musicsData) => setState({ musics: musicsData }),
                onError: () => NotificationManager.Create('Error', "Failed To Get Algum", 'danger')
            })
    }, [token.isLoaded])

    return (
        <div className="music-table">
            <div className="music-table-header">
                <span>#</span>
                <span className="music-table-grow">TITLE</span>
                <span>TIME</span>
            </div>
            <div className="music-table-rows">
                { state.musics.map((val, i) => <div key={i} onClick={() => setMusic(val)} className="music-table-row">
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