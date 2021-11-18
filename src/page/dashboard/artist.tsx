import React from "react";

import Library from '@elements/Library'
import Popup from '@elements/Popup'
import Input from '@elements/Input'
import ImageSelector from '@elements/ImageSelector'

import RestWraper from "@global/RestWraper";

import NotificationManager from '@global/NotificationManager'

export interface IArtist {
    id: number
    name: string
}

export interface IArtistProps { }

export interface IArtistState { 
    artist: IArtist
    artistIndex: number
    artists: IArtist[]

    isEditorOpend: boolean
    editorImage: string
}

export default class ArtistPage extends React.Component<IArtistProps, IArtistState> {

    imageFile = React.createRef<ImageSelector>() 
    
    rest = new RestWraper<IArtist>("artist")

    constructor(props: IArtistProps) {
        super(props)
        this.state = { artist: { id: -1, name: "" }, artistIndex: -1, artists: [], isEditorOpend: false, editorImage: "" }
    }

    componentDidMount = () => this.getArtists();

    //#region Server Requests

    getArtists = () => {
        this.rest.GetAll({
            onSuccess: (Data) => this.setState({ artists: Data }),
            onError: () => NotificationManager.Create("Error", "Error Getting Artists", 'danger')
        })
    }

    createArtist = () => {
        if (this.state.editorImage != "") {
            this.imageFile.current.getImage((image) =>
                this.rest.Create({
                    data: this.state.artist,
                    file: image,
                    onSuccess: (Data) => {
                        this.state.artists.push(Data)
                        this.setState({artists: this.state.artists, editorImage: "", isEditorOpend: false})
                        NotificationManager.Create("Success", "Success Updating Artist", 'success')
                    },
                    onError: () => NotificationManager.Create("Error", "Error Updating Artist", 'danger')
                }),
            (data) => NotificationManager.Create("Error", "Error Updating Artist", 'danger'))
        }
        else
            NotificationManager.Create("Error", "Artist Cover Missing", 'danger')
    }

    updateArtist = () => {
        //Maybe only make one request?
        this.rest.Update({
            index: this.state.artist.id,
            data: this.state.artist,
            onSuccess: (data) => {
                NotificationManager.Create("Success", "Successfull Update", 'success')
                this.state.artists[this.state.artistIndex] = this.state.artist
                this.setState({artists: this.state.artists})
            },
            onError: (data) => NotificationManager.Create("Error", "Error Updating Artist", 'danger')
        })

        if (this.state.editorImage != "") {
            this.imageFile.current.getImage((image) =>
                this.rest.UpdateImage({
                    index: this.state.artist.id,
                    data: this.state.artist,
                    file: image,
                    onSuccess: () => { },
                    onError: (data) => NotificationManager.Create("Error", "Error Updating Artist", 'danger')
                }),
            (data) => NotificationManager.Create("Error", "Error Updating Artist", 'danger'))
        }
    }

    deleteArtist = () => {
        this.rest.Delete({
            index: this.state.artist.id,
            onSuccess: () => {
                this.state.artists.splice(this.state.artistIndex, 1)
                this.setState({artists: this.state.artists, isEditorOpend: false, artistIndex: -1, editorImage: ""})
                NotificationManager.Create("success", "Success Deleting Artist", 'success')
            },
            onError: () => NotificationManager.Create("Error", "Error Deleting Artist", 'danger')
        })
    }

    //#endregion

    //#region Editor

    setEditor = (state: boolean) => {
        this.setState({isEditorOpend: state})
    }

    unSelectArtist = () => this.setState({artist: { id: -1, name: "" }, editorImage: "" })

    selectArtist = (index: number) => {
        this.state.artist.id = this.state.artists[index].id
        this.state.artist.name = this.state.artists[index].name
        this.setState({artist: this.state.artist, artistIndex: index})
    }

    getEditorImage = () : string =>  this.state.editorImage == "" ? this.state.artist.id == -1 ? "" : this.rest.GetImage(this.state.artist.id) : this.state.editorImage

    //#endregion

    render = () => {
        return (
            <>
                <Library>
                    <Library.Item onClick={() => { this.unSelectArtist(); this.setEditor(true) }} icon="plus" title="New" />
                    { this.state.artists.map((val, index) => <Library.Item key={index} onClick={() => { this.selectArtist(index); this.setEditor(true) }} iconSize={50} icon="play" image={ this.rest.GetImage(val.id) } title={ val.name }/> ) }
                </Library>
                <Popup isOpened={this.state.isEditorOpend} >
                    <Popup.Header onClose={() => { this.setEditor(false) }} title="Edit" type="BACK" />
                    <Popup.Content id="ArtistDashboard">
                        <ImageSelector ref={ this.imageFile } onChange={ (img) => this.setState({editorImage: img}) } image={ this.getEditorImage() } icon="pencil"/>
                        <div>
                            <Input label="Name" value={ this.state.artist.name } onChange={(v) => { this.state.artist.name = v; this.setState({artist: this.state.artist}) } }/>
                        </div>
                    </Popup.Content>
                    <Popup.Footer>
                        { this.state.artist.id == -1 ?
                            <Popup.Footer.Button text="Create" onClick={this.createArtist}/>:
                            <>
                                <Popup.Footer.Button text="Save" onClick={this.updateArtist}/>
                                <Popup.Footer.Button text="Delete" onClick={this.deleteArtist}/>
                            </>
                        }
                    </Popup.Footer>
                </Popup>
            </>
        );
    }
}