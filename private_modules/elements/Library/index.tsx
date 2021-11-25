import React from "react";
import Icon from "../Icon";
import ImageSelector from "../ImageSelector";

import './library.scss'

export interface ILibraryItemProps { 
    title?: string
    image?: string
    iconSize?: number
    icon?: string
    onClick?: () => void
}

const LibraryItem : React.FC<ILibraryItemProps> = props => {
    return <ImageSelector onClick={ props.onClick ? props.onClick : () => {} } image={ props.image } text={props.title} icon={props.icon} iconSize={props.iconSize} />
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