import React, { useEffect } from "react"

import { IMusic } from "@interface/database"

import RestWraper from "@global/RestWraper"
import NotificationManager from "@global/NotificationManager"

import musicContext from "@context/MusicContext"
import userContext from "@context/AuthContext"

import ContextMenu, { IContextMenuProps } from "@elements/ContextMenu"

import './music_table.scss'

export interface IMusicTableProps {
    target: string
    arguments: { [key: string]: string; }
}

export interface IMusicTableState {
    musics: IMusic[]
}

export type MusicTableHandle = {
    getMusics: () => IMusic[];
  };

const MusicTable = React.forwardRef<MusicTableHandle, IMusicTableProps>((props: IMusicTableProps, ref) => {

    const { token } = React.useContext(userContext)
    const { setMusic } = React.useContext(musicContext)

    const [ contextMenu, setContextMenu ] = React.useState<IContextMenuProps>({ visible: false, position: { x:0, y:0} })
    const [ state, setState ] = React.useState<IMusicTableState>({ musics: [] })

    var restMusic = new RestWraper<IMusic>(props.target)

    React.useImperativeHandle(ref, () => ({
        getMusics: () => state.musics
    }));

    useEffect(() => {
        if (token.isLoaded)
            restMusic.GetWhere({
                token: token.token,
                arguments: props.arguments,
                onSuccess: (musicsData) => setState({ musics: musicsData }),
                onError: () => NotificationManager.Create('Error', "Failed To Get Algum", 'danger')
            })
    }, [token.isLoaded])

    const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        setContextMenu({visible: true, position: { x: event.pageX + 5, y: event.pageY + 5 }})
        document.addEventListener('click', (e) => setContextMenu({...contextMenu, visible: false}))
    }

    return (
        <>
            <ContextMenu visible={contextMenu.visible} position={contextMenu.position}>
                <ContextMenu.Item text="Like" icon="heart" onClick={() => {}}/>
                <ContextMenu.Item text="Add To Playlist" icon="playlist-plus" onClick={() => {}}/>
            </ContextMenu>
            <div className="music-table">
                <div className="music-table-header">
                    <span>#</span>
                    <span className="music-table-grow">TITLE</span>
                    <span>TIME</span>
                </div>
                <div className="music-table-rows">
                    { state.musics.map((val, i) => <div onContextMenu={onContextMenu} key={i} onClick={() => setMusic([val])} className="music-table-row">
                        <span>{ i + 1 }</span>
                        <span className="music-table-grow">{ val.name }</span>
                        <span>{ val.length }</span>
                    </div>) }
                </div>
            </div>
        </>
    );
})

export default MusicTable