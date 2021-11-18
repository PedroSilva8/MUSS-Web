import React, { ChangeEvent } from "react";
import Icon from "@elements/Icon";

import './imageselector.scss'

export interface IImageSelectorProps { 
    icon: string
    iconSize: number
    image: string
    text: string
    onChange: (image: string) => void
    onClick?: () => void
}

export interface IImageSelectorState { }

export default class ImageSelector extends React.Component<IImageSelectorProps, IImageSelectorState> {

    public imageFile = React.createRef<HTMLInputElement>() 

    static defaultProps = {
        icon: "",
        iconSize: 24,
        image: "",
        onChange: () => { },
        text: ""
    };

    onClick = () => this.props.onClick ? this.props.onClick() : this.imageFile.current.click()

    getImage = (onSuccess: (image: string) => void, onError: (err: DOMException) => void) : string => {
        if (this.imageFile.current.files && this.imageFile.current.files[0]) {
            var FR = new FileReader()
            FR.onload = () => onSuccess(FR.result.toString())
            FR.onerror= () => onError(FR.error)
            FR.readAsDataURL(this.imageFile.current.files[0])
        }

        return ""
    }

    onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0])
            this.props.onChange(URL.createObjectURL(e.target.files[0]))
    }

    render = () => {
        return (
            <div className="element-image-selector" onClick={ this.onClick }>
                <div className="element-image">
                    <img src={ this.props.image }/>
                    <input type='file' accept="image/*" onChange={this.onChange} ref={ this.imageFile } style={{display: 'none'}}/>
                    <div className="element-image-overlay"><Icon fontSize={ this.props.iconSize } icon={ this.props.icon }/></div>
                </div>
                { this.props.text ? <span>{ this.props.text }</span> : <></> }
            </div>
        );
    }
}