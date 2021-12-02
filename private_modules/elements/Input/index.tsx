import React from "react";

import './input.scss'

export interface IInputProps {
    label: string
    value: string
    placeholder: string
    onChange: (value: string) => void
}

const Input = (props: IInputProps) => {

    return (
        <div className="element-input">
            { props.label != "" ? <span>{ props.label }</span> : <></> }
            <input value={props.value} onChange={(e) => { props.onChange(e.target.value) }} placeholder={props.placeholder}/>
        </div>
    );
}

Input.defaultProps = {
    label: "",
    value: "",
    placeholder: "",
    onChange: () => { }
};

export default Input