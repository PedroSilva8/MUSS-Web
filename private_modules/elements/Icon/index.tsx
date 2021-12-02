import React from "react";

import './icon.scss'

export interface IIconProps { 
    icon: string
    id: string
    fontSize: string | number
    canHover: boolean
    onClick: () => void
}

const Icon = (props: IIconProps) => {

    return (
        <div id={ props.id } onClick={ props.onClick } className={ "element-icon " + (props.canHover ? "element-icon-hover " : "") }>
            <div style={{ fontSize: props.fontSize, width: props.fontSize, height: props.fontSize }} className={ "mdi mdi-" +  props.icon }></div>
        </div>
    );
}

Icon.defaultProps = {
    icon: "",
    id: "",
    fontSize: 24,
    canHover: false,
    onClick: () => {}
}

export default Icon