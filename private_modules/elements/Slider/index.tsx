import React from "react";

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
    value: number
}

export default class Slider extends React.Component<ISliderProps, ISliderState> {
    
    slider = React.createRef<HTMLInputElement>() 
    sliderProgress = React.createRef<HTMLDivElement>() 

    public static defaultProps = {
        id: "",
        step: 0.1,
        value: 50,
        maxValue: 100,
        onChange: () => {}
    };

    constructor(props: ISliderProps) {
        super(props)
        this.state = { value: props.value, isDragging: false }
    }

    componentDidMount = () => this.updateSlider((this.props.value * 100 / this.props.maxValue).toString())

    componentDidUpdate(prevProps: ISliderProps) {
        if (prevProps.value != this.props.value){
            this.setState({value: this.props.value})
            this.updateSlider((this.props.value * 100 / this.props.maxValue).toString())
        }
    }

    updateSlider = (value: any) => {
        this.sliderProgress.current.style.width = `calc(${value}% - 5px)`
    }

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.updateSlider((parseFloat(e.target.value) * 100 / this.props.maxValue).toString())
        this.props.onChange(parseFloat(e.target.value))
        this.setState({isDragging: true})
    }

    render = () => {
        return (
            <div id={ this.props.id } className="element-slider">
                <input ref={this.slider} onInput={this.onChange} type="range" min="0" max={this.props.maxValue} value={this.state.value} step={this.props.step} />
                <div ref={this.sliderProgress} className="element-slider-progress"/>
            </div>
        );
    }
}