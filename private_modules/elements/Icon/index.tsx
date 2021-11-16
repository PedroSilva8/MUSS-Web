import React from "react";

import './icon.scss'

export interface IIconProps { 
    icon: string
    fontSize: string | number
    canHover: boolean
    onClick: () => void
}

export interface IIconState { }

export default class Icon extends React.Component<IIconProps, IIconState> {

    public static defaultProps = {
        icon: "",
        fontSize: 24,
        canHover: false,
        onClick: () => {}
    };

    render = () => {
        return (
            <div onClick={this.props.onClick} className={"element-icon " + (this.props.canHover ? "element-icon-hover " : "")}>
                <div style={{fontSize: this.props.fontSize, width: this.props.fontSize, height: this.props.fontSize}} className={ "mdi mdi-" +  this.props.icon }></div>
            </div>
        );
    }
}