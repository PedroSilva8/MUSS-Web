import React, { ChangeEvent } from "react";

import Icon from "@elements/Icon";
import Slider from "@elements/Slider";

/* Importing typescript-cookie directly is giving an error */
import Cookies from 'js-cookie'

import './MusicPlayer.scss'

export interface IMusicPlayerProps { 
    src: string
}

export interface IMusicPlayerState { 
    playerSlider: number
    isPlaying: boolean
    duration: number
    audio: number
}

export default class MusicPlayer extends React.Component<IMusicPlayerProps, IMusicPlayerState> {

    audioFile = React.createRef<HTMLInputElement>() 
    audio: HTMLAudioElement = new Audio()

    public static defaultProps = {
        src: ""
    };

    constructor(props: IMusicPlayerProps) {
        super(props)
        this.state = { playerSlider: 0, isPlaying: false, duration: 100, audio: this.audio.volume = !isNaN(parseFloat(Cookies.get("volume"))) ? parseFloat(Cookies.get("volume")) : 1 }
    }

    componentDidMount = () => {            
        this.audio.ontimeupdate = this.onAudioProgress
        this.audio.onloadeddata = this.onAudioLoad
        this.audio.oncanplaythrough = () => this.audio.play()
        this.audio.src = this.props.src
    }

    onSelectAudio = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0])
            return
        
        this.audio.src = URL.createObjectURL(e.target.files[0])
        this.setState({isPlaying: true})
    }

    onAudioLoad = () => {
        this.setState({duration: this.audio.duration*1000})
    }

    onAudioProgress = (e: ProgressEvent<EventTarget>) => {
        this.setState({playerSlider: this.audio.currentTime * 1000})
    }

    onAudioSliderChange = (val: number) => {
        this.audio.currentTime = Math.min(Math.max(val/1000, 0), this.state.duration/1000 - 1)
        this.setState({playerSlider: val, isPlaying: true})
        this.audio.play()
    }

    changeAudioState = () => {
        this.setState({isPlaying: !this.state.isPlaying}, () => this.state.isPlaying ? this.audio.play() : this.audio.pause())
    }

    onAudioChange = (val: number) => {
        this.setState({audio: val})
        this.audio.volume = val
        Cookies.set('volume', val.toString())
    }

    hasMusic = () => this.audioFile.current.files && this.audioFile.current.files[0]

    getMusic = (onSuccess: (image: string) => void, onError: (err: DOMException) => void) => {
        if (this.hasMusic()) {
            var FR = new FileReader()
            FR.onload = () => onSuccess(FR.result.toString())
            FR.onerror= () => onError(FR.error)
            FR.readAsDataURL(this.audioFile.current.files[0])
        }
    }

    render = () => {
        return (
            <div className="element-music-player">
                <input type="file" ref={this.audioFile} onChange={this.onSelectAudio} style={{display: 'none'}}/>
                <Icon onClick={() => this.audioFile.current.click() } canHover={true} icon="upload"/>
                <Icon canHover={true} onClick={this.changeAudioState} icon={ this.state.isPlaying ? "pause" : "play" }/>
                <Slider id="player-slider" onChange={this.onAudioSliderChange} value={this.state.playerSlider} maxValue={this.state.duration} />
                <Icon canHover={true} icon="volume-high"/>
                <div className="audioSlider">
                    <Slider onChange={this.onAudioChange} value={this.state.audio} step={0.01} maxValue={1}/>
                </div>
            </div>
        );
    }
}