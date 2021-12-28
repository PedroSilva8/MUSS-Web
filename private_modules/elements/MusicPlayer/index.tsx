import React, { ChangeEvent, useEffect, useRef } from "react"

import Icon from "@elements/Icon"
import Slider from "@elements/Slider"

/* Importing typescript-cookie directly is giving an error */
import Cookies from 'js-cookie'

import './MusicPlayer.scss'

export interface IMusicPlayerProps { 
    id: string
    canUpload: boolean
}

export interface IMusicPlayerState { 
    playerSlider: number
    volume: number,
    audio: HTMLAudioElement,
    curMusic: number
    musics: string[]
}

export type MusicPlayerHandle = {
    hasMusic: () => File
    getMusic: (onSuccess: (image: string) => void, onError: (err: DOMException) => void) => void
    setMusic: (musics: string[]) => void
}

const MusicPlayer = React.forwardRef<MusicPlayerHandle, IMusicPlayerProps>((props, ref) => {

    const audioFile = React.createRef<HTMLInputElement>()
    const stateRef = useRef<IMusicPlayerState>() /* Needed Because Of Audio Callback */

    const [ state, setState ] = React.useState<IMusicPlayerState>({
         playerSlider: 0,
         volume: !isNaN(parseFloat(Cookies.get("volume"))) ? parseFloat(Cookies.get("volume")) : 1,
         audio: new Audio(),
         curMusic: 0,
         musics: []
        })

    React.useImperativeHandle(ref, () => ({
        hasMusic: hasMusic,
        getMusic: getMusic,
        setMusic: setMusic
    }))

    useEffect(() => {
        stateRef.current = state
    }, [state])

    useEffect(() => {
        state.audio.ontimeupdate = () => {
            setState({...stateRef.current, playerSlider: state.audio.currentTime * 1000})
        }
        state.audio.oncanplaythrough = () => state.audio.play()
        state.audio.onended = onAudioEnd
        
        if (state.musics.length != 0)
            state.audio.src = state.musics[state.curMusic]
    }, [])

    useEffect(() => {
        if (state.musics.length != 0) {
            state.audio.src = state.musics[state.curMusic]
            state.audio.play()
        }
    }, [state.curMusic, state.musics])

    useEffect(() => {
        state.audio.volume = state.volume
    }, [state.volume])

    const onSelectAudio = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0])
            return
        
            state.audio.src = URL.createObjectURL(e.target.files[0])
    }

    const setMusic = (musics: string[]) => {
        setState({...state, musics: musics, curMusic: 0})
    }

    const onMusicSliderChange = (val: number) => {
        state.audio.currentTime = Math.min(Math.max(val / 1000, 0), state.audio.duration - 1)
        setState({...state, playerSlider: val})
        state.audio.play()
    }

    const changeAudioState = () => {
        state.audio.paused ? state.audio.play() : state.audio.pause()
    }

    const onAudioEnd = () => {
        const state = stateRef.current
        if (state.curMusic + 1 >= state.musics.length)
            setState({...state, curMusic: 0})
        else 
            setState({...state, curMusic: state.curMusic + 1})
        state.audio.src = state.musics[state.curMusic]
        state.audio.play()
    }

    const onAudioChange = (val: number) => {
        setState({...state, volume: val})
        Cookies.set('volume', val.toString())
    }

    const hasMusic = () => audioFile.current.files && audioFile.current.files[0]

    const getMusicLength = () => {
        if (hasMusic())
            return new Date(state.audio.duration * 1000).toISOString().substr(11, 8);
        return "00:00:00"
    }

    const getMusic = (onSuccess: (image: string) => void, onError: (err: DOMException) => void) => {
        if (hasMusic()) {
            var FR = new FileReader()
            FR.onload = () => onSuccess(FR.result.toString())
            FR.onerror= () => onError(FR.error)
            FR.readAsDataURL(audioFile.current.files[0])
        }
    }

    
    return (
        <div id={ props.id } className="element-music-player">
            { props.canUpload ?  <>
                    <Icon onClick={() => audioFile.current.click() } canHover={true} icon="upload"/>
                    <input type="file" ref={audioFile} onChange={onSelectAudio} style={{display: 'none'}}/>
                </>:<></>
            }
            <Icon canHover={true} onClick={changeAudioState} icon={ !state.audio.paused ? "pause" : "play" }/>
            <Slider id="player-slider" onChange={onMusicSliderChange} value={state.playerSlider} maxValue={isNaN(state.audio.duration) ? 0 : state.audio.duration * 1000} />
            <Icon canHover={true} icon="volume-high"/>
            <div className="audioSlider">
                <Slider onChange={onAudioChange} value={state.volume /* Using Audio Volume Directly Causes Lag */} step={0.01} maxValue={1}/>
            </div>
        </div>
    )
})

export default MusicPlayer