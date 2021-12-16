import React, { useContext, useState } from "react"

import Input from '@elements/Input'
import TextArea from '@elements/TextArea'
import ImageSelector from '@elements/ImageSelector'
import ItemSelector from '@elements/ItemSelector'

import RestWraper from "@global/RestWraper"

import { defaultAlbum, IAlbum, IArtist } from "@interface/database"

import userContext from "@context/AuthContext"

import './scss/album.scss'
import GenericEditor, { IGetFiles } from "./genericEditor"

export interface IAlbumState { 
    album: IAlbum | null
    artist: IArtist | null
    selectingArtist: boolean
    editorImage: string
    isEditing: boolean
}

const AlbumPage = () => {
    
    const RestName = "album"
    
    const rest = new RestWraper<IArtist>(RestName)
    
    const imageFile = React.createRef<ImageSelector>()

    const { token } = useContext(userContext)
    const [state, setState] = useState<IAlbumState>({ 
        album: null,
        artist: null,
        editorImage: "",
        selectingArtist: false,
        isEditing: false
    })
    
    const getEditorImage = () => state.album && state.editorImage == "" ? (state.album.id == -1 ? "" : rest.GetImage(state.album.id)) : state.editorImage

    const onSelectItem = (item: IAlbum) => setState({...state, album: (item ? item : defaultAlbum)})
    const onUnSelectItem = () => setState({...state, album: null})

    const getFiles = (props: IGetFiles) => state.editorImage == "" ? () => {} : imageFile.current.getImage((Result) => props.onSucess({image: Result}), () => props.onError())

    const onEditorChange = (v: boolean) => {
        if (state.selectingArtist) {
            state.selectingArtist = false
            state.isEditing = true
        }
        else
            state.isEditing = v
        setState({...state})
        return state.isEditing
    }

    return (
        <GenericEditor<IAlbum> id="AlbumDashboard" token={token.token} isEditing={state.isEditing} onEditorChange={onEditorChange} getFiles={getFiles} onSelectItem={onSelectItem} onUnSelectItem={onUnSelectItem} selectedItem={ state.album } restName={RestName}>
            { state.selectingArtist ? <ItemSelector<IArtist> onSelect={(id) => { state.album.artist_id = id; setState({...state, artist: state.artist, selectingArtist: false}) } } database="artist" textColumn="name"/>:<></> }
            <div id={ state.selectingArtist ? "album-edit-invisible" : "" }>
                <div id="album-editor-selector">
                    <ImageSelector iconSize={50} text="Cover" ref={ imageFile } onChange={ (img) => setState({...state, editorImage: img}) } image={ getEditorImage() } icon="pencil"/>
                    <ImageSelector iconSize={50} text="Artist" onClick={() => setState({...state, selectingArtist: true})} image={ state.album?.artist_id == -1 ? "" : new RestWraper<IArtist>("artist").GetImage(state.album?.artist_id) } icon="pencil"/>
                </div>
                <div id="album-editor-description">
                    <Input label="Name" value={ state.album?.name } onChange={(v) => { state.album.name = v; setState({...state, album: state.album}) } }/>
                    <TextArea label="Description" value={ state.album?.description } onChange={(v) => { state.album.description = v; setState({...state, album: state.album}) } }/>
                </div>
            </div>
        </GenericEditor>
    );
}

export default AlbumPage