import React from "react";

import Library from '@elements/Library'
import Popup from '@elements/Popup'
import Input from '@elements/Input'
import TextArea from '@elements/TextArea'
import ImageSelector from '@elements/ImageSelector'
import ItemSelector from '@elements/ItemSelector'

import RestWraper from "@global/RestWraper";

import NotificationManager from '@global/NotificationManager'
import Networking from "@modules/global/Networking";
import { IArtist } from "./artist";

import './scss/album.scss'

export interface IAlbum {
    [key: string]: number | string; /* allow interface to be indexed with string */
    id: number
    artist_id: number
    name: string
    description: string
}

export interface IAlbumProps { }

export interface IAlbumState { 
    album: IAlbum
    albumIndex: number
    albums: IAlbum[]

    isEditorOpend: boolean
    selectingArtist: boolean
    editorImage: string
}

export default class AlbumPage extends React.Component<IAlbumProps, IAlbumState> {

    imageFile = React.createRef<ImageSelector>() 
    
    rest = new RestWraper<IAlbum>("album")

    constructor(props: IAlbumProps) {
        super(props)
        this.state = { album: { id: -1, artist_id: -1, name: "", description: "" }, albumIndex: -1, albums: [], isEditorOpend: false, selectingArtist: false, editorImage: "" }
    }

    componentDidMount = () => this.getAlbum();

    //#region Server Requests

    getAlbum = () => {
        this.rest.GetAll({
            onSuccess: (Data) => this.setState({ albums: Data }),
            onError: () => NotificationManager.Create("Error", "Error Getting Artists", 'danger')
        })
    }

    createAlbum = () => {
        if (this.state.editorImage != "") {
            this.imageFile.current.getImage((image) =>
                this.rest.Create({
                    data: this.state.album,
                    file: Networking.file2Argument(image),
                    onSuccess: (Data) => {
                        this.state.albums.push(Data)
                        this.setState({albums: this.state.albums, editorImage: "", isEditorOpend: false})
                        NotificationManager.Create("Success", "Success Updating Artist", 'success')
                    },
                    onError: () => NotificationManager.Create("Error", "Error Updating Artist", 'danger')
                }),
            (data) => NotificationManager.Create("Error", "Error Updating Artist", 'danger'))
        }
        else
            NotificationManager.Create("Error", "Artist Cover Missing", 'danger')
    }

    updateAlbum = () => {
        //Maybe only make one request?
        this.rest.Update({
            index: this.state.album.id,
            data: this.state.album,
            onSuccess: (data) => {
                NotificationManager.Create("Success", "Successfull Update", 'success')
                this.state.albums[this.state.albumIndex] = this.state.album
                this.setState({albums: this.state.albums})
            },
            onError: (data) => NotificationManager.Create("Error", "Error Updating Artist", 'danger')
        })

        if (this.state.editorImage != "") {
            this.imageFile.current.getImage((image) =>
                this.rest.UpdateImage({
                    index: this.state.album.id,
                    data: this.state.album,
                    file: Networking.file2Argument(image),
                    onSuccess: () => { },
                    onError: (data) => NotificationManager.Create("Error", "Error Updating Artist", 'danger')
                }),
            (data) => NotificationManager.Create("Error", "Error Updating Artist", 'danger'))
        }
    }

    deleteAlbum = () => {
        this.rest.Delete({
            index: this.state.album.id,
            onSuccess: () => {
                this.state.albums.splice(this.state.albumIndex, 1)
                this.setState({albums: this.state.albums, isEditorOpend: false, albumIndex: -1, editorImage: ""})
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

    unSelectAlbum = () => this.setState({album: { id: -1, artist_id: -1, name: "", description: "" }, editorImage: "" })

    selectAlbum = (index: number) => {
        this.state.album.id = this.state.albums[index].id
        this.state.album.artist_id = this.state.albums[index].artist_id
        this.state.album.name = this.state.albums[index].name
        this.state.album.description = this.state.albums[index].description
        this.setState({album: this.state.album, albumIndex: index})
    }

    getEditorImage = () : string =>  this.state.editorImage == "" ? this.state.album.id == -1 ? "" : this.rest.GetImage(this.state.album.id) : this.state.editorImage

    //#endregion

    render = () => {
        return (
            <>
                <Library>
                    <Library.Item onClick={() => { this.unSelectAlbum(); this.setEditor(true) }} icon="plus" title="New" />
                    { this.state.albums.map((val, index) => <Library.Item key={index} onClick={() => { this.selectAlbum(index); this.setEditor(true) }} iconSize={50} icon="play" image={ this.rest.GetImage(val.id) } title={ val.name }/> ) }
                </Library>
                <Popup isOpened={this.state.isEditorOpend} >
                    <Popup.Header onClose={() => this.state.selectingArtist ? this.setState({selectingArtist: false}) : this.setEditor(false) } title={this.state.selectingArtist ? "Select Artist" : this.state.album.id == -1 ? "Create New" : "Edit" } type="BACK" />
                    <Popup.Content id="AlbumDashboard">
                        { this.state.selectingArtist ?
                            <ItemSelector<IAlbum> onSelect={(id) => { this.state.album.artist_id = id; this.setState({album: this.state.album, selectingArtist: false}) } } database="artist" textColumn="name"/>:
                            <>
                                <div id="album-editor-selector">
                                    <ImageSelector ref={ this.imageFile } onChange={ (img) => this.setState({editorImage: img}) } image={ this.getEditorImage() } icon="pencil"/>
                                    <ImageSelector onClick={() => this.setState({selectingArtist: true})} image={ this.state.album.artist_id == -1 ? "" : new RestWraper<IArtist>("artist").GetImage(this.state.album.artist_id) } icon="pencil"/>
                                </div>
                                <div id="album-editor-description">
                                    <Input label="Name" value={ this.state.album.name } onChange={(v) => { this.state.album.name = v; this.setState({album: this.state.album}) } }/>
                                    <TextArea label="Description" value={ this.state.album.description } onChange={(v) => { this.state.album.description = v; this.setState({album: this.state.album}) } }/>
                                </div>
                            </>
                        }
                    </Popup.Content>
                    <Popup.Footer>
                        { this.state.selectingArtist ? <></> :
                            this.state.album.id == -1 ?
                                <Popup.Footer.Button text="Create" onClick={this.createAlbum}/>:
                                <>
                                    <Popup.Footer.Button text="Save" onClick={this.updateAlbum}/>
                                    <Popup.Footer.Button text="Delete" onClick={this.deleteAlbum}/>
                                </>
                        }
                    </Popup.Footer>
                </Popup>
            </>
        );
    }
}