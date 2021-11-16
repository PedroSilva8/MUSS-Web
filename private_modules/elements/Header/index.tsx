import React from "react";

import './header.scss'

export interface IHeaderChunkProps { 
    id?: string
    children?: React.ReactNode
    isMaxed?: boolean
}

const HeaderChunk = (props: IHeaderChunkProps) : React.ReactElement => {
    return (
        <div className="element-header-chunk" id={ props.id } style={{ flex: props.isMaxed ? 1 : 0 }}>
            { props.children }
        </div>
    )
}


interface IHeaderComposition {
    Chunk: React.FC<IHeaderChunkProps>;
}

export interface IHeaderProps { }

interface IHeaderState { }

const HeaderContext = React.createContext<IHeaderState | undefined>(undefined)

const Header : React.FC<IHeaderProps> & IHeaderComposition = props => {
    return (
        <HeaderContext.Provider value={undefined}>
            <div className="element-header">
                { props.children }
            </div>
        </HeaderContext.Provider>
    )
}

Header.Chunk = HeaderChunk

export default Header