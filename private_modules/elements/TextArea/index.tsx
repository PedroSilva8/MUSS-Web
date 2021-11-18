import React from "react";

import './textarea.scss'

export interface ITextAreaProps {
    label: string
    value: string
    placeholder: string
    onChange: (value: string) => void
}

export interface ITextAreaState { }

export default class TextArea extends React.Component<ITextAreaProps, ITextAreaState> {

    public static defaultProps = {
        label: "",
        value: "",
        placeholder: "",
        onChange: () => { }
    };

    render = () => {
        return (
            <div className="element-textarea">
                { this.props.label != "" ? <span>{ this.props.label }</span> : <></> }
                <textarea value={ this.props.value } onChange={(e) => { this.props.onChange(e.target.value) }} placeholder={ this.props.placeholder } />
            </div>
        );
    }
}