import React, { useContext } from "react";
import Icon from "../Icon";

import './popup.scss'

export interface IPopupHeaderProps { 
    type: 'CLOSE' | 'BACK'
    title?: string
    onClose?: () => void
}

const PopupHeader : React.FC<IPopupHeaderProps> = props => {
    return (
        <div className="element-popup-header">
            { props.type == 'BACK' ? <Icon onClick={props.onClose} canHover={true} icon="arrow-left" /> : <></> }
            { props.title ? <span>{ props.title }</span> : <></> }
            <div style={{flex: 1}}/>
            { props.type == 'CLOSE' ? <Icon onClick={props.onClose} canHover={true} icon="close" /> : <></> }
        </div>
    )
}

export interface IPopupButtonProps { 
    text: string
    onClick?: () => void
}

const PopupButton : React.FC<IPopupButtonProps> = props => {
    return (
        <button onClick={ props.onClick } className="element-popup-button">
            { props.text }
        </button>
    )
}

export interface IPopupFooterProps { }

interface IPopupFooterComposition {
    Button: React.FC<IPopupButtonProps>
}

const PopupFooter : React.FC<IPopupFooterProps> & IPopupFooterComposition = props => {
    return (
        <div className="element-popup-footer">
            { props.children }
        </div>
    )
}

PopupFooter.Button = PopupButton

export interface IPopupContentProps { 
    id?: string
}

const PopupContent : React.FC<IPopupContentProps> = props => {
    return (
        <div className="element-popup-content" id={ props.id }>
            { props.children }
        </div>
    )
}

interface IPopupComposition {
    Header: React.FC<IPopupHeaderProps>
    Content: React.FC<IPopupContentProps>
    Footer: React.FC<IPopupFooterProps> & IPopupFooterComposition
}

export interface IPopupProps { 
    isOpened : boolean
}

const Popup : React.FC<IPopupProps> & IPopupComposition = props => {
    return (
        <>
            { props.isOpened ?
                <div className="element-popup">
                    <div className="element-popup-box">
                        {props.children}
                    </div>
                </div>:
                <></>
            }
        </>
    )
}

Popup.Header = PopupHeader;
Popup.Content = PopupContent
Popup.Footer = PopupFooter

export default Popup