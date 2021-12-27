import React from "react"
import Icon from "../Icon"

import './contextMenu.scss'

export interface IContextMenuItemProps {
    text: string
    icon: string
    onClick?: () => void
}

const ContextMenuItem : React.FC<IContextMenuItemProps> = props => {
    return (
        <div className="element-context-menu-item" onClick={props.onClick}>
            <Icon icon={props.icon}/>
            <span>{props.text}</span>
        </div>
    )
}

interface IContextMenuComposition {
    Item: React.FC<IContextMenuItemProps>;
}

export interface IContextMenuProps { 
    visible: boolean
    position: { x: number, y: number }
}

const ContextMenu : React.FC<IContextMenuProps> & IContextMenuComposition = props => {

    return (
        <div style={{display: props.visible ? 'flex' : 'none', left: props.position.x, top: props.position.y}} className="element-context-menu">
            { props.children }
        </div>
    )
}

ContextMenu.Item = ContextMenuItem

ContextMenu.defaultProps = {
    visible: false,
    position: { x: 0, y: 0 }
}

export default ContextMenu