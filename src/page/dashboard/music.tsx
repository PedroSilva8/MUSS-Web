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
import Networking from "@global/Networking";
import NotificationManager from "@global/NotificationManager";


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
    }

    sendMusicCreate = (music: string, cover: string) => {

    }

    createMusic = async (music: string, cover: string) => {
        this.state.music.album_id = this.state.albums[this.state.selectedAlbum].id
        this.setState({music: this.state.music})

        this.restMusic.CreateWFiles({
            data: this.state.music,
            files: {
                music: music,
                cover: cover
            },
            onSuccess: () => {
                NotificationManager.Create("Success", "Success Creating Music", 'success')
                this.onLoadAlbum()
                this.musicFile.current?.audio.pause()
                this.popupGoBack()
            },
            onError: () => NotificationManager.Create("Error", "Error Creating Music", 'danger')
        })
    }

    onCreateMusic = () => {
        if (!this.musicFile.current.hasMusic()) {
            NotificationManager.Create("Error", "Error Creating Music - Missing Audio File", 'danger')
            return;
        }
        
        this.musicFile.current.getMusic(
            (music) => {
                if (this.coverFile.current.hasImage())
                    this.coverFile.current.getImage(
                        (img) => this.createMusic(music, img),
                        (err) => {}
                    )
                this.createMusic(music, "")
            },
            () => NotificationManager.Create("Error", "Error Creating Music - Faild To Load Audio File", 'danger')
        )
    }

    onUpdateMusic = () => {
        this.musicFile.current.getMusic(
            (music) => this.restMusic.UpdateFile({
                index: this.state.music.id, 
                files: { music: music }, 
                onSuccess: () =>NotificationManager.Create("Success", "Success Updating Music", 'success'),
                onError: () => NotificationManager.Create("Error", "Error Updating Music File", 'danger') 
            }),
            () => {}
        )

        this.coverFile.current.getImage(
            (cover) => this.restMusic.UpdateFile({
                index: this.state.music.id, 
                files: { image: cover }, 
                onSuccess: () =>NotificationManager.Create("Success", "Success Updating Music", 'success'),
                onError: () => NotificationManager.Create("Error", "Error Updating Music Cover File", 'danger') 
            }),
            () => {}
        )

        this.restMusic.Update({
            index: this.state.music.id,
            data: this.state.music,
            onSuccess: () => NotificationManager.Create("Success", "Success Updating Music", 'success'),
            onError: () => NotificationManager.Create("Error", "Error Updating Music", 'danger')
        })
    }

    onDeleteMusic = () => {
        this.restMusic.Delete({
            index: this.state.music.id,
            onSuccess: () => { 
                NotificationManager.Create("Success", "Success Deleting Music", 'success')
                this.state.musics.splice(this.state.selectedMusic, 1)
                this.musicFile.current?.audio.pause()
                this.setState({musics: this.state.musics, selectedMusic: -1, music: { id: -1, album_id: -1, name: "", description: "" }})
                this.popupGoBack()
            },
            onError: () => NotificationManager.Create("Error", "Error Deleting Music", 'danger')
        })
    }

    onLoadAlbum = () => {
        this.restMusic.GetWhere({
            arguments: {
                album_id: this.state.albums[this.state.selectedAlbum].id.toString()
            },
            onSuccess: (music) => this.setState({musics: music}),
            onError: () => NotificationManager.Create("Error", "Error Loading Albums", 'danger')
        })
    }

    popupGoBack = () => {
        if (this.state.selectedMusic == -2)
            this.setState({isEditorOpend: false})
        else
            this.setState({selectedMusic: -2, music: { id: -1, album_id: -1, name: "", description: "" }, musicCover: ""})
        this.musicFile.current?.audio.pause()
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
                    { this.state.albums.map((val, i) => <Library.Item key={i} iconSize={50} icon="pencil" onClick={() => this.setState({isEditorOpend: true, selectedAlbum: i}, () => this.onLoadAlbum())} image={ this.restAlbum.GetImage(val.id) } title={val.name}/>) }
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
                                <ImageSelector ref={ this.coverFile } onChange={(img) => this.setState({musicCover: img})} image={this.state.musicCover != "" || this.state.music.id == -1 ? this.state.musicCover : this.restMusic.GetImage(this.state.music.id)} text="Cover"/>
                                <Input onChange={(v) => { this.state.music.name = v; this.setState({music: this.state.music}) }} value={ this.state.music.name } label="Name"/>
                                <TextArea onChange={(v) => { this.state.music.description = v; this.setState({music: this.state.music}) }} value={ this.state.music.description } label="Description"/>
                                <MusicPlayer src={this.restMusic.GetFile(this.state.music.id, "music")} ref={ this.musicFile }/>
                            </>
                        }
                    </Popup.Content>
                    <Popup.Footer>
                        { this.state.selectedMusic == -1 ? 
                            <Popup.Footer.Button onClick={this.onCreateMusic} text="Create"/>:
                            this.state.selectedMusic >= 0 ?
                            <>
                                <Popup.Footer.Button onClick={this.onUpdateMusic} text="Save"/>
                                <Popup.Footer.Button onClick={this.onDeleteMusic} text="Delete"/>
                            </>:<></>
                        }
                    </Popup.Footer>
                </Popup>
            </>
        );
    }
}