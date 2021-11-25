import React from "react";

import Library from '@elements/Library'
import Popup from '@elements/Popup'
import ImageSelector from '@elements/ImageSelector'
import Input from "@elements/Input"
import MusicPlayer from "@elements/MusicPlayer"
import TextArea from "@elements/TextArea"

import { IAlbum, IMusic } from "src/interface/database"

import RestWraper from "@global/RestWraper"

import './scss/music.scss'
import Networking from "@modules/global/Networking";


export interface IMusicProps { }

export interface IMusicState { 
    isEditorOpend: boolean
    musicCover: string

    albums: IAlbum[]
    
    music: IMusic
    musics: IMusic[]

    selectedAlbum: number
    selectedMusic: number
}

export default class MusicPage extends React.Component<IMusicProps, IMusicState> {

    coverFile = React.createRef<ImageSelector>()
    musicFile = React.createRef<MusicPlayer>() 

    restMusic = new RestWraper<IMusic>("music")
    restAlbum = new RestWraper<IAlbum>("album")

    constructor(props: IMusicProps) {
        super(props)
        this.state = { 
            isEditorOpend: false,
            musicCover: "",
            music: { id: -1, album_id: -1, name: "", description: "" },
            albums: [],
            musics: [],
            selectedAlbum: -1,
            selectedMusic: -2
         }
    }

    componentDidMount = () => {
        this.restAlbum.GetAll({
            onSuccess: (albums) => this.setState({albums: albums}),
            onError: () => { }
        })
        this.restMusic.GetAll({
            onSuccess: (music) => this.setState({musics: music}),
            onError: () => { }
        })
    }
    createMusic = (music: string, cover: string) => {
        this.state.music.album_id = this.state.albums[this.state.selectedAlbum].id
        this.setState({music: this.state.music})
        this.restMusic.CreateWFiles({
            data: this.state.music,
            files: {
                music: Networking.file2Argument(music),
                cover: cover == "" ? "" : Networking.file2Argument(cover)
            },
            onSuccess: () => {},
            onError: () => {}
        })
    }

    onCreateMusic = () => {
        this.musicFile.current.getMusic(
            (music) => {
                if (this.coverFile.current.hasImage())
                    this.coverFile.current.getImage(
                        (img) => this.createMusic(music, img),
                        (err) => {}
                    )
                this.createMusic(music, "")
            },
            () => {}
        )
    }

    popupGoBack = () => {
        if (this.state.selectedMusic == -2)
            this.setState({isEditorOpend: false})
        else if (this.state.selectedMusic == -1)
            this.setState({selectedMusic: -2})
        else
            this.setState({selectedMusic: -2})
    }

    getPopupTitle = () => {
        if (this.state.selectedMusic == -2 && this.state.selectedAlbum != -1)
            return "Edit " + this.state.albums[this.state.selectedAlbum].name
        if (this.state.selectedMusic == -1)
            return "Add Music"
        else
            return "Edit " + this.state.music.name
    }

    render = () => {
        return (
            <>
                <Library>
                    { this.state.albums.map((val, i) => <Library.Item key={i} iconSize={50} icon="pencil" onClick={() => this.setState({isEditorOpend: true, selectedAlbum: i})} image={ this.restAlbum.GetImage(val.id) } title={val.name}/>) }
                </Library>
                <Popup isOpened={this.state.isEditorOpend} >
                    <Popup.Header onClose={this.popupGoBack} title={this.getPopupTitle()} type="BACK" />
                    <Popup.Content id="MusicDashboard">
                        { this.state.selectedMusic == -2 ?
                            <Library>
                                <Library.Item onClick={() => this.setState({selectedMusic: -1, music: this.state.music})} iconSize={50} icon="plus" title="New"/>
                                { this.state.musics.map((val, i) => <Library.Item key={i} iconSize={50} icon="pencil" onClick={() => this.setState({selectedMusic: i, music: this.state.musics[i]})} image={this.restMusic.GetImage(val.id)} title={val.name}/>) }
                            </Library>:
                            <>
                                <ImageSelector ref={ this.coverFile } onChange={(img) => this.setState({musicCover: img})} image={this.state.musicCover} text="Cover"/>
                                <Input onChange={(v) => { this.state.music.name = v; this.setState({music: this.state.music}) }} value={ this.state.music.name } label="Name"/>
                                <TextArea onChange={(v) => { this.state.music.description = v; this.setState({music: this.state.music}) }} value={ this.state.music.description } label="Description"/>
                                <MusicPlayer ref={ this.musicFile }/>
                            </>
                        }
                    </Popup.Content>
                    <Popup.Footer>
                        { this.state.selectedMusic == -1 ? 
                            <Popup.Footer.Button onClick={this.onCreateMusic} text="Create"/>:
                            <Popup.Footer.Button text="Save"/>
                        }
                    </Popup.Footer>
                </Popup>
            </>
        );
    }
}