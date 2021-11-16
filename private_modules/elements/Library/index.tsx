import React from "react";
import Icon from "../Icon";

import './library.scss'

export interface ILibraryItemProps { 
    title?: string
    image?: string
    iconSize?: number
    icon?: string
    onClick?: () => void
}

const LibraryItem : React.FC<ILibraryItemProps> = props => {
    return (
        <div className="element-library-item" onClick={props.onClick}>
            <div className="element-library-item-image">
                { props.image ? <img src={props.image}/> : <></> }
                { props.icon ? <div className="element-library-item-overlay"><Icon fontSize={ props.iconSize } icon={ props.icon }/></div> : <></> }
            </div>
            { props.title ? <span>{ props.title }</span> : <></> }
        </div>
    )
}

interface ILibraryComposition {
    Item: React.FC<ILibraryItemProps>;
}

export interface ILibraryProps { }

interface ITreeViewState { }

const LibraryContext = React.createContext<ITreeViewState | undefined>(undefined)

const Library : React.FC<ILibraryProps> & ILibraryComposition = props => {
    return (
        <LibraryContext.Provider value={undefined}>
            <div className="element-library">
                { props.children }
            </div>
        </LibraryContext.Provider>
    )
}

Library.Item = LibraryItem

export default Library