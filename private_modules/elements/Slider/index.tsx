import React, { useEffect, useState } from "react";

import './slider.scss'

export interface ISliderProps {
    id: string
    value: number
    step: number
    maxValue: number
    onChange: (value: number) => void
}

export interface ISliderState { 
    isDragging: boolean
    current: boolean
}

const Slider = (props: ISliderProps) => {
    const [ state, setState ] = useState<ISliderState>({ isDragging: false, current: false })

    const slider = React.createRef<HTMLInputElement>() 
    const sliderProgress = React.createRef<HTMLDivElement>() 

    useEffect(() => { 
        if (state.current) {
            updateSlider((props.value * 100 / props.maxValue).toString())
            setState({...state, current: true})
        }
        else
            updateSlider((props.value * 100 / props.maxValue).toString())
    })

    const updateSlider = (value: any) => sliderProgress.current.style.width = `calc(${value}% - 5px)`

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSlider((parseFloat(e.target.value) * 100 / props.maxValue).toString())
        props.onChange(parseFloat(e.target.value))
        setState({...state, isDragging: true})
    }

    return (
        <div id={ props.id } className="element-slider">
            <input ref={slider} onInput={onChange} type="range" min="0" max={props.maxValue} value={props.value} step={props.step} />
            <div ref={sliderProgress} className="element-slider-progress"/>
        </div>
    );
}

Slider.defaultProps = {
    id: "",
    step: 0.1,
    value: 50,
    maxValue: 100,
    onChange: () => {}
}

export default Slider