import React, { useContext, useState } from "react";

import ImageSelector from '@elements/ImageSelector'
import Input from "@elements/Input"
import TextArea from "@elements/TextArea"
import MusicPlayer from "@elements/MusicPlayer"

import { defaultAlbum, defaultMusic, IAlbum, IMusic } from "@interface/database"

import RestWraper from "@global/RestWraper"

import userContext from "@context/AuthContext";

import GenericEditor, { IGetFiles } from "./genericEditor";

import './scss/music.scss'
import NotificationManager from "@modules/global/NotificationManager";

export interface IMusicState {
    album: IAlbum | null
    music: IMusic | null
    cover: string

    isEditingAlbum: boolean
    isEditingMusic: boolean
}

const MusicPage = () => {
    const RestNameMusic = "music"
    const RestNameAlbum = "album"
    
    const rest = new RestWraper<IMusic>(RestNameMusic)
    
    const musicEditor = React.createRef<GenericEditor<IMusic>>()
    const coverFile = React.createRef<ImageSelector>()
    const musicFile = React.createRef<MusicPlayer>() 

    const { token } = useContext(userContext)
    const [state, setState] = useState<IMusicState>({ 
        album: null,
        music: null,
        cover: "",
        isEditingAlbum: false,
        isEditingMusic: false
    })
    
    const onSelectAlbum = (item: IAlbum) => setState({...state, album: item ? item: defaultAlbum})

    const onSelectMusic = (item: IMusic) => {
        item = item ? item: defaultMusic
        item.album_id = state.album.id
        setState({...state, music: item})
    }

    const onAlbumChange = (newValue: boolean) => {

        if (state.music) {
            state.music = null
            state.isEditingMusic = false
            state.isEditingAlbum = true
        }
        else
            state.isEditingAlbum = newValue

        setState({...state})
        return state.isEditingAlbum
    }
    const onMusicChange = (newValue: boolean) => {
        state.isEditingMusic = newValue
        setState({...state})
        return newValue;
    }

    const PopupTitle = () => {
        if (state.music?.id == -1)
            return "Creating Music - " + state.music.name
        if (state.music)
            return "Editing Music - " + state.music.name 
        return "Select Music"
    }

    const getFiles = (props: IGetFiles) => {

        if (musicFile.current.hasMusic())
            musicFile.current.getMusic(
                (music) => {
                    if (coverFile.current.hasImage())
                        coverFile.current.getImage(
                            (img) => props.onSucess({music: music, cover: img}),
                            () => NotificationManager.Create("Error", "Error Creating Music - Faild To Load Cover File", 'danger')
                        )
                    props.onSucess({music: music})
                },
                () => NotificationManager.Create("Error", "Error Creating Music - Faild To Load Audio File", 'danger')
            )
        else if (coverFile.current.hasImage())
            coverFile.current.getImage(
                (img) => props.onSucess({cover: img}),
                () => NotificationManager.Create("Error", "Error Creating Music - Faild To Load Cover File", 'danger')
            )
        else
                props.onSucess({})
    }

    const onCreate = () => musicEditor.current.onCreateItem()

    const onUpdate = () => musicEditor.current.onUpdateItem()
    
    const onDelete = () => musicEditor.current.onDeleteItem()
 
    return (
        <>
            <GenericEditor<IAlbum> onCreate={onCreate} onUpdate={onUpdate} onDelete={onDelete} isCreating={state.music ? state.music.id == -1 ? 'true' : 'false' : 'hide'} isEditing={state.isEditingAlbum} getTitle={PopupTitle} onEditorChange={onAlbumChange} canCreate={false} onSelectItem={onSelectAlbum} selectedItem={state.album} restName={RestNameAlbum} token={token.token}>
                <GenericEditor<IMusic> ref={musicEditor} getFiles={getFiles} isEditing={state.isEditingMusic} onEditorChange={onMusicChange} onSelectItem={onSelectMusic} id="MusicDashboard" hasPagination={false} usePopup={false} selectedItem={state.music} restName={RestNameMusic} token={token.token}>
                    <ImageSelector ref={ coverFile } onChange={(img) => setState({...state, cover: img})} image={state.cover != "" || state.music?.id == -1 ? state.cover : rest.GetImage(state.music?.id)} text="Cover"/>
                    <Input onChange={(v) => { state.music.name = v; setState({...state, music: state.music}) }} value={ state.music?.name } label="Name"/>
                    <TextArea onChange={(v) => { state.music.description = v; setState({...state, music: state.music}) }} value={ state.music?.description } label="Description"/>
                    <MusicPlayer canUpload={true} src={rest.GetFile(state.music?.id, "music")} ref={ musicFile }/>
                </GenericEditor>
            </GenericEditor>
        </>
    );
}

export default MusicPage