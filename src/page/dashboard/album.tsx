import React, { useContext, useEffect, useState } from "react"

import Library from '@elements/Library'
import Popup from '@elements/Popup'
import Input from '@elements/Input'
import TextArea from '@elements/TextArea'
import ImageSelector from '@elements/ImageSelector'
import ItemSelector from '@elements/ItemSelector'

import RestWraper from "@global/RestWraper"
import NotificationManager from '@global/NotificationManager'

import { IAlbum, IArtist } from "@interface/database"

import userContext from "@context/AuthContext"

import './scss/album.scss'

export interface IAlbumProps { }

export interface IAlbumState { 
    album: IAlbum
    albumIndex: number
    albums: IAlbum[]

    isEditorOpend: boolean
    selectingArtist: boolean
    editorImage: string
}

const AlbumPage = () => {
    
    const { token } = useContext(userContext)
    const [state, setState] = useState<IAlbumState>({ 
        album: { 
            id: -1, 
            artist_id: -1, 
            name: "", 
            description: "" 
        }, 
        albumIndex: -1,
        albums: [], 
        isEditorOpend: false, 
        selectingArtist: false, 
        editorImage: "" 
    })

    const imageFile = React.createRef<ImageSelector>() 
    
    const rest = new RestWraper<IAlbum>("album")

    useEffect(() => getAlbum(), [])

    //#region Server Requests

    const getAlbum = () => {
        rest.GetAll({
            token: token,
            onSuccess: (Data) => setState({...state, albums: Data }),
            onError: () => NotificationManager.Create("Error", "Error Getting Artists", 'danger')
        })
    }

    const createAlbum = () => {
        if (state.editorImage != "") {
            imageFile.current.getImage((image) =>
                rest.CreateWFiles({
                    data: state.album,
                    token: token,
                    files: { file: image },
                    onSuccess: (Data) => {
                        state.albums.push(Data)
                        setState({...state, albums: state.albums, editorImage: "", isEditorOpend: false})
                        NotificationManager.Create("Success", "Success Updating Artist", 'success')
                    },
                    onError: () => NotificationManager.Create("Error", "Error Updating Artist", 'danger')
                }),
            (data) => NotificationManager.Create("Error", "Error Updating Artist", 'danger'))
        }
        else
            NotificationManager.Create("Error", "Artist Cover Missing", 'danger')
    }

    const updateAlbum = () => {
        //Maybe only make one request?
        rest.Update({
            index: state.album.id,
            data: state.album,
            token: token,
            onSuccess: (data) => {
                NotificationManager.Create("Success", "Successfull Update", 'success')
                state.albums[state.albumIndex] = state.album
                setState({...state, albums: state.albums})
            },
            onError: (data) => NotificationManager.Create("Error", "Error Updating Artist", 'danger')
        })

        if (state.editorImage != "") {
            imageFile.current.getImage((image) =>
                rest.UpdateImage({
                    index: state.album.id,
                    file: image,
                    token: token,
                    onSuccess: () => { },
                    onError: (data) => NotificationManager.Create("Error", "Error Updating Artist", 'danger')
                }),
            (data) => NotificationManager.Create("Error", "Error Updating Artist", 'danger'))
        }
    }

    const deleteAlbum = () => {
        rest.Delete({
            index: state.album.id,
            token: token,
            onSuccess: () => {
                state.albums.splice(state.albumIndex, 1)
                setState({...state, albums: state.albums, isEditorOpend: false, albumIndex: -1, editorImage: ""})
                NotificationManager.Create("success", "Success Deleting Artist", 'success')
            },
            onError: () => NotificationManager.Create("Error", "Error Deleting Artist", 'danger')
        })
    }

    //#endregion

    //#region Editor

    const setEditor = (editor: boolean) => setState({...state, isEditorOpend: editor})

    const unSelectAlbum = () => {
        state.album.id = -1
        state.album.artist_id = -1
        state.album.name = ""
        state.album.description = ""
        setState({...state, album: state.album, editorImage: "" })
    }

    const selectAlbum = (index: number) => {
        state.album.id = state.albums[index].id
        state.album.artist_id = state.albums[index].artist_id
        state.album.name = state.albums[index].name
        state.album.description = state.albums[index].description
        setState({...state, album: state.album, albumIndex: index})
    }

    const getEditorImage = () : string =>  state.editorImage == "" ? state.album.id == -1 ? "" : rest.GetImage(state.album.id) : state.editorImage

    //#endregion

    return (
        <>
            <Library>
                <Library.Item onClick={() => { unSelectAlbum(); setEditor(true) }} iconSize={100} placeholderIcon="plus" icon="plus" title="New" />
                { state.albums.map((val, index) => <Library.Item key={index} onClick={() => { selectAlbum(index); setEditor(true) }} iconSize={50} icon="play" image={ rest.GetImage(val.id) } title={ val.name }/> ) }
            </Library>
            <Popup isOpened={state.isEditorOpend} >
                <Popup.Header onClose={() => state.selectingArtist ? setState({...state, selectingArtist: false}) : setEditor(false) } title={state.selectingArtist ? "Select Artist" : state.album.id == -1 ? "Create New" : "Edit" } type="BACK" />
                <Popup.Content id="AlbumDashboard">
                    { state.selectingArtist ? <ItemSelector<IAlbum> onSelect={(id) => { state.album.artist_id = id; setState({...state, album: state.album, selectingArtist: false}) } } database="artist" textColumn="name"/>:<></> }
                    <div id={ state.selectingArtist ? "album-edit-invisible" : "" }>
                        <div id="album-editor-selector">
                            <ImageSelector iconSize={50} text="Cover" ref={ imageFile } onChange={ (img) => setState({...state, editorImage: img}) } image={ getEditorImage() } icon="pencil"/>
                            <ImageSelector iconSize={50} text="Artist" onClick={() => setState({...state, selectingArtist: true})} image={ state.album.artist_id == -1 ? "" : new RestWraper<IArtist>("artist").GetImage(state.album.artist_id) } icon="pencil"/>
                        </div>
                        <div id="album-editor-description">
                            <Input label="Name" value={ state.album.name } onChange={(v) => { state.album.name = v; setState({...state, album: state.album}) } }/>
                            <TextArea label="Description" value={ state.album.description } onChange={(v) => { state.album.description = v; setState({...state, album: state.album}) } }/>
                        </div>
                    </div>
                </Popup.Content>
                <Popup.Footer>
                    { state.selectingArtist ? <></> :
                        state.album.id == -1 ?
                            <Popup.Footer.Button text="Create" onClick={createAlbum}/>:
                            <>
                                <Popup.Footer.Button text="Save" onClick={updateAlbum}/>
                                <Popup.Footer.Button text="Delete" onClick={deleteAlbum}/>
                            </>
                    }
                </Popup.Footer>
            </Popup>
        </>
    );
}

export default AlbumPage