import React from "react";
import Icon from "../Icon";

import './input.scss'

export interface IInputProps {
    id: string
    label?: string
    value: string
    placeholder: string
    icon?: string
    type: 'text' | 'password' | 'date' | 'number'
    direction : 'row' | 'column'
    onChange: (value: string) => void
}

const Input = (props: IInputProps) => {

    return (
        <div id={props.id} className={ "element-input " + (props.direction == 'row' ? "row" : "column")}>
            { props.label ? <span>{ props.label }</span> : <></> }
            { props.icon ? <Icon icon={props.icon} /> : <></> }
            <input type={props.type} value={props.value} onChange={(e) => { props.onChange(e.target.value) }} placeholder={props.placeholder}/>
        </div>
    );
}

Input.defaultProps = {
    id: "",
    value: "",
    placeholder: "",
    direction: 'row',
    type: 'text',
    onChange: () => { }
};

export default Input