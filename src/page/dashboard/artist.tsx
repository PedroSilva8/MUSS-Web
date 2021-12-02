import React, { useEffect, useState } from "react";

import Library from '@elements/Library'
import Popup from '@elements/Popup'
import Input from '@elements/Input'
import ImageSelector from '@elements/ImageSelector'

import { IArtist } from "@interface/database";

import RestWraper from "@global/RestWraper";

import NotificationManager from '@global/NotificationManager'

import './scss/artist.scss'

export interface IArtistState { 
    artist: IArtist
    artistIndex: number
    artists: IArtist[]

    isEditorOpend: boolean
    editorImage: string
}

const ArtistPage = () => {

    const [state, setState] = useState<IArtistState>({ 
        artist: { 
            id: -1,
            name: "" 
        }, 
        artistIndex: -1, 
        artists: [], 
        isEditorOpend: false, 
        editorImage: "" 
    })
    
    const imageFile = React.createRef<ImageSelector>() 
    
    const rest = new RestWraper<IArtist>("artist")

    useEffect(() => getArtists(), [])


    //#region Server Requests

    const getArtists = () => {
        rest.GetAll({
            onSuccess: (artists) => setState({...state, artists }),
            onError: () => NotificationManager.Create("Error", "Error Getting Artists", 'danger')
        })
    }

    const createArtist = () => {
        if (state.editorImage != "") {
            imageFile.current.getImage((image) =>
                rest.Create({
                    data: state.artist,
                    file: image,
                    onSuccess: (artist) => {
                        state.artists.push(artist)
                        setState({...state, artists: state.artists, editorImage: "", isEditorOpend: false})
                        NotificationManager.Create("Success", "Success Updating Artist", 'success')
                    },
                    onError: () => NotificationManager.Create("Error", "Error Updating Artist", 'danger')
                }),
            () => NotificationManager.Create("Error", "Error Updating Artist", 'danger'))
        }
        else
            NotificationManager.Create("Error", "Artist Cover Missing", 'danger')
    }

    const updateArtist = () => {
        //Maybe only make one request?
        rest.Update({
            index: state.artist.id,
            data: state.artist,
            onSuccess: () => {
                NotificationManager.Create("Success", "Successfull Update", 'success')
                state.artists[state.artistIndex] = state.artist
                setState({...state, artists: state.artists})
            },
            onError: () => NotificationManager.Create("Error", "Error Updating Artist", 'danger')
        })

        if (state.editorImage != "") {
            imageFile.current.getImage((image) =>
                rest.UpdateImage({
                    index: state.artist.id,
                    file: image,
                    onSuccess: () => { },
                    onError: () => NotificationManager.Create("Error", "Error Updating Artist", 'danger')
                }),
            () => NotificationManager.Create("Error", "Error Updating Artist", 'danger'))
        }
    }

    const deleteArtist = () => {
        rest.Delete({
            index: state.artist.id,
            onSuccess: () => {
                state.artists.splice(state.artistIndex, 1)
                setState({...state, artists: state.artists, isEditorOpend: false, artistIndex: -1, editorImage: ""})
                NotificationManager.Create("success", "Success Deleting Artist", 'success')
            },
            onError: () => NotificationManager.Create("Error", "Error Deleting Artist", 'danger')
        })
    }

    //#endregion

    //#region Editor

    const setEditor = (editor: boolean) => setState({...state, isEditorOpend: editor})

    const unSelectArtist = () => {
        //Declaring a empty artist inline doesnt update for some reason
        state.artist.id = -1
        state.artist.name = ""
        setState({...state, artist: state.artist, editorImage: "" })
    }

    const selectArtist = (index: number) => {
        state.artist.id = state.artists[index].id
        state.artist.name = state.artists[index].name
        setState({...state, artist: state.artist, artistIndex: index})
    }

    const getEditorImage = () : string =>  state.editorImage == "" ? state.artist.id == -1 ? "" : rest.GetImage(state.artist.id) : state.editorImage

    //#endregion

    return (
        <>
            <Library>
                <Library.Item onClick={() => { unSelectArtist(); setEditor(true) }} icon="plus" title="New" />
                { state.artists.map((val, index) => <Library.Item key={index} onClick={() => { selectArtist(index); setEditor(true) }} iconSize={50} icon="play" image={ rest.GetImage(val.id) } title={ val.name }/> ) }
            </Library>
            <Popup isOpened={state.isEditorOpend} >
                <Popup.Header onClose={() => { setEditor(false) }} title="Edit" type="BACK" />
                <Popup.Content id="ArtistDashboard">
                    <ImageSelector text="Cover" iconSize={50} ref={ imageFile } onChange={ (img) => setState({...state, editorImage: img}) } image={ getEditorImage() } icon="pencil"/>
                    <div>
                        <Input label="Name" value={ state.artist.name } onChange={(v) => { state.artist.name = v; setState({...state, artist: state.artist}) } }/>
                    </div>
                </Popup.Content>
                <Popup.Footer>
                    { state.artist.id == -1 ?
                        <Popup.Footer.Button text="Create" onClick={createArtist}/>:
                        <>
                            <Popup.Footer.Button text="Save" onClick={updateArtist}/>
                            <Popup.Footer.Button text="Delete" onClick={deleteArtist}/>
                        </>
                    }
                </Popup.Footer>
            </Popup>
        </>
    );
}

export default ArtistPage