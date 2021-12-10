import React from "react";

import './input.scss'

export interface IInputProps {
    label: string
    value: string
    placeholder: string
    type: 'text' | 'password' | 'date' | 'number'
    direction : 'row' | 'column'
    onChange: (value: string) => void
}

const Input = (props: IInputProps) => {

    return (
        <div className={ "element-input " + (props.direction == 'row' ? "row" : "column")}>
            { props.label != "" ? <span>{ props.label }</span> : <></> }
            <input type={props.type} value={props.value} onChange={(e) => { props.onChange(e.target.value) }} placeholder={props.placeholder}/>
        </div>
    );
}

Input.defaultProps = {
    label: "",
    value: "",
    placeholder: "",
    direction: 'row',
    type: 'text',
    onChange: () => { }
};

export default Input