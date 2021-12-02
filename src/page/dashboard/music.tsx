import React, { useEffect, useReducer, useState } from "react";

import Library from '@elements/Library'
import Popup from '@elements/Popup'
import ImageSelector from '@elements/ImageSelector'
import Input from "@elements/Input"
import MusicPlayer from "@elements/MusicPlayer"
import TextArea from "@elements/TextArea"

import { IAlbum, IMusic } from "src/interface/database"

import RestWraper from "@global/RestWraper"

import './scss/music.scss'
import NotificationManager from "@global/NotificationManager";


export interface IMusicState {
    isEditorOpend: boolean
    musicCover: string
    
    musics: IMusic[]
    albums: IAlbum[]

    music: IMusic
}

const MusicPage = () => {
    const [state, setState] = useState<IMusicState>({ 
        isEditorOpend: false,
        musicCover: "",
        music: { id: -1, album_id: -1, name: "", description: "" },
        musics: [],
        albums: []
    })

    const  [ selectedAlbum, setSelectedAlbum ] = useState<number>(-1)
    const  [ selectedMusic, setSelectedMusic ] = useState<number>(-2)

    var coverFile = React.createRef<ImageSelector>()
    var musicFile = React.createRef<MusicPlayer>() 

    var restMusic = new RestWraper<IMusic>("music")
    var restAlbum = new RestWraper<IAlbum>("album")

    
    useEffect(() =>
        restAlbum.GetAll({
            onSuccess: (albums) => setState({...state, albums}),
            onError: () => { }
        }), [])

    useEffect(() => onLoadAlbum(), [selectedAlbum])

    //#region Functions

    const createMusic = async (music: string, cover: string) => {
        state.music.album_id = state.albums[selectedAlbum].id
        setState({...state, music: state.music})

        restMusic.CreateWFiles({
            data: state.music,
            files: {
                music: music,
                cover: cover
            },
            onSuccess: () => {
                NotificationManager.Create("Success", "Success Creating Music", 'success')
                onLoadAlbum()
                musicFile.current?.audio.pause()
                popupGoBack()
            },
            onError: () => NotificationManager.Create("Error", "Error Creating Music", 'danger')
        })
    }

    const onCreateMusic = () => {
        if (!musicFile.current.hasMusic()) {
            NotificationManager.Create("Error", "Error Creating Music - Missing Audio File", 'danger')
            return;
        }
        
        musicFile.current.getMusic(
            (music) => {
                if (coverFile.current.hasImage())
                    coverFile.current.getImage(
                        (img) => createMusic(music, img),
                        (err) => {}
                    )
                createMusic(music, "")
            },
            () => NotificationManager.Create("Error", "Error Creating Music - Faild To Load Audio File", 'danger')
        )
    }

    const onUpdateMusic = () => {
        musicFile.current.getMusic(
            (music) => restMusic.UpdateFile({
                index: state.music.id, 
                files: { music: music }, 
                onSuccess: () =>NotificationManager.Create("Success", "Success Updating Music", 'success'),
                onError: () => NotificationManager.Create("Error", "Error Updating Music File", 'danger') 
            }),
            () => {}
        )

        coverFile.current.getImage(
            (cover) => restMusic.UpdateFile({
                index: state.music.id, 
                files: { image: cover }, 
                onSuccess: () =>NotificationManager.Create("Success", "Success Updating Music", 'success'),
                onError: () => NotificationManager.Create("Error", "Error Updating Music Cover File", 'danger') 
            }),
            () => {}
        )

        restMusic.Update({
            index: state.music.id,
            data: state.music,
            onSuccess: () => NotificationManager.Create("Success", "Success Updating Music", 'success'),
            onError: () => NotificationManager.Create("Error", "Error Updating Music", 'danger')
        })
    }

    const onDeleteMusic = () => {
        restMusic.Delete({
            index: state.music.id,
            onSuccess: () => { 
                NotificationManager.Create("Success", "Success Deleting Music", 'success')
                state.musics.splice(selectedMusic, 1)
                musicFile.current?.audio.pause()
                setState({...state, music: { id: -1, album_id: -1, name: "", description: "" }})
                setSelectedMusic(-1)
                popupGoBack()
            },
            onError: () => NotificationManager.Create("Error", "Error Deleting Music", 'danger')
        })
    }

    const onLoadAlbum = () => {
        if (selectedAlbum == -1)
            return;
        restMusic.GetWhere({
            arguments: {
                album_id: state.albums[selectedAlbum].id.toString()
            },
            onSuccess: (musics) => setState({...state, musics}),
            onError: () => NotificationManager.Create("Error", "Error Loading Albums", 'danger')
        })
    }

    const popupGoBack = () => {
        if (selectedMusic == -2)
            setState({...state, isEditorOpend: false})
        else {
            setState({...state, music: { id: -1, album_id: -1, name: "", description: "" }, musicCover: ""})
            setSelectedMusic(-2)
        }
        musicFile.current?.audio.pause()
    }

    const getPopupTitle = () => {
        if (selectedMusic == -2 && selectedAlbum != -1)
            return "Edit " + state.albums[selectedAlbum].name
        if (selectedMusic == -1)
            return "Add Music"
        else
            return "Edit " + state.music.name
    }

    //#endregion

    return (
        <>
            <Library>
                { state.albums.map((val, i) => <Library.Item key={i} iconSize={50} icon="pencil" onClick={() => { setState({...state, isEditorOpend: true}), setSelectedAlbum(i) }} image={ restAlbum.GetImage(val.id) } title={val.name}/>) }
            </Library>
            <Popup isOpened={state.isEditorOpend} >
                <Popup.Header onClose={popupGoBack} title={getPopupTitle()} type="BACK" />
                <Popup.Content id="MusicDashboard">
                    { selectedMusic == -2 ?
                        <Library>
                            <Library.Item onClick={() => { setState({...state, music: state.music}); setSelectedMusic(-1) } } iconSize={50} icon="plus" title="New"/>
                            { state.musics.map((val, i) => <Library.Item key={i} iconSize={50} icon="pencil" onClick={() =>  { setState({...state, music: state.musics[i]}); setSelectedMusic(i);   }} image={restMusic.GetImage(val.id)} title={val.name}/>) }
                        </Library>:
                        <>
                            <ImageSelector ref={ coverFile } onChange={(img) => setState({...state, musicCover: img})} image={state.musicCover != "" || state.music.id == -1 ? state.musicCover : restMusic.GetImage(state.music.id)} text="Cover"/>
                            <Input onChange={(v) => { state.music.name = v; setState({...state, music: state.music}) }} value={ state.music.name } label="Name"/>
                            <TextArea onChange={(v) => { state.music.description = v; setState({...state, music: state.music}) }} value={ state.music.description } label="Description"/>
                            <MusicPlayer src={restMusic.GetFile(state.music.id, "music")} ref={ musicFile }/>
                        </>
                    }
                </Popup.Content>
                <Popup.Footer>
                    { selectedMusic == -1 ? 
                        <Popup.Footer.Button onClick={onCreateMusic} text="Create"/>:
                        selectedMusic >= 0 ?
                        <>
                            <Popup.Footer.Button onClick={onUpdateMusic} text="Save"/>
                            <Popup.Footer.Button onClick={onDeleteMusic} text="Delete"/>
                        </>:<></>
                    }
                </Popup.Footer>
            </Popup>
        </>
    );
}

export default MusicPage