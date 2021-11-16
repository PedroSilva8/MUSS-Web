import React from "react";

import './input.scss'

export interface IInputProps {
    label: string
    value: string
    placeholder: string
    onChange: (value: string) => void
}

export interface IInputState { }

export default class Input extends React.Component<IInputProps, IInputState> {

    public static defaultProps = {
        label: "",
        value: "",
        placeholder: "",
        onChange: () => { }
    };

    render = () => {
        return (
            <div className="element-input">
                { this.props.label != "" ? <span>{ this.props.label }</span> : <></> }
                <input value={this.props.value} onChange={(e) => { this.props.onChange(e.target.value) }} placeholder={this.props.placeholder}/>
            </div>
        );
    }
}