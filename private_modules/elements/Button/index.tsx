import React from "react";

import './button.scss'

export interface IButtonProps {
    text: string
    holding: boolean
    onClick: () => void
}

const Button = (props: IButtonProps) => {
    return (
        <button className={"element-button" + (props.holding ? " holding" : "")} onClick={props.onClick}>{ props.text }</button>
    );
}

Button.defaultProps = {
    text: "",
    holding: false,
    onClick: () => { }
};

export default Button