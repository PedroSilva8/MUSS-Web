import React from "react";

import './textarea.scss'

export interface ITextAreaProps {
    label: string
    value: string
    placeholder: string
    onChange: (value: string) => void
}

const TextArea = (props: ITextAreaProps) => {

    return (
        <div className="element-textarea">
            { props.label != "" ? <span>{ props.label }</span> : <></> }
            <textarea value={ props.value } onChange={(e) => { props.onChange(e.target.value) }} placeholder={ props.placeholder } />
        </div>
    );
}

TextArea.defaultProps = {
    label: "",
    value: "",
    placeholder: "",
    onChange: () => { }
}

export default TextArea