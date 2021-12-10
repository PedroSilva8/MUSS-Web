import React from "react";

import './button.scss'

export interface IButtonProps {
    text: string
    onClick: () => void
}

const Button = (props: IButtonProps) => {

    return (
        <button className="element-button" onClick={props.onClick}>{ props.text }</button>
    );
}

Button.defaultProps = {
    title: "",
    onClick: () => { }
};

export default Button