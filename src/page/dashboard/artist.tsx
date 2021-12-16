import React, { useContext, useState } from "react"

import Input from '@elements/Input'
import ImageSelector from '@elements/ImageSelector'

import { defaultArtist, IArtist } from "@interface/database"

import userContext from "@context/AuthContext"

import RestWraper from "@global/RestWraper"

import GenericEditor, { IGetFiles } from "./genericEditor"

import './scss/artist.scss'

export interface IArtistState { 
    artist: IArtist | null
    editorImage: string
    isEditing: boolean
}

const ArtistPage = () => {

    const RestName = "artist"
    
    const rest = new RestWraper<IArtist>(RestName)
    
    const imageFile = React.createRef<ImageSelector>()

    const { token } = useContext(userContext)
    const [state, setState] = useState<IArtistState>({ 
        artist: null,
        editorImage: "",
        isEditing: false
    })
    
    const getEditorImage = () => state.artist && state.editorImage == "" ? (state.artist.id == -1 ? "" : rest.GetImage(state.artist.id)) : state.editorImage

    const onSelectItem = (item: IArtist) => setState({...state, artist: (item ? item : defaultArtist)})
    const onUnSelectItem = () => setState({...state, artist: null})

    const getFiles = (props: IGetFiles) => state.editorImage == "" ? () => {} : imageFile.current.getImage((Result) => props.onSucess({image: Result}), () => props.onError())

    const onEditorChange = (v: boolean) => {
        state.isEditing = v
        setState({...state, isEditing: state.isEditing})
        return v
    }

    return (
        <>
            <GenericEditor<IArtist> id="ArtistDashboard" isEditing={state.isEditing} onEditorChange={onEditorChange} token={token.token} getFiles={getFiles} onSelectItem={onSelectItem} onUnSelectItem={onUnSelectItem} selectedItem={ state.artist } restName={RestName}>
                <ImageSelector text="Cover" iconSize={50} ref={ imageFile } onChange={ (img) => setState({...state, editorImage: img}) } image={ getEditorImage() } icon="pencil"/>
                <div>
                    <Input label="Name" value={ state.artist?.name } onChange={(v) => { if (state.artist) { state.artist.name = v; setState({...state, artist: state.artist}) } } }/>
                </div>
            </GenericEditor>
        </>
    );
}

export default ArtistPage