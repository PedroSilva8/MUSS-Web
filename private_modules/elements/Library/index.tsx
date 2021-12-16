import React from "react"
import Button from "../Button"
import ImageSelector from "../ImageSelector"

import './library.scss'

export interface ILibraryItemProps { 
    title?: string
    image?: string
    iconSize?: number
    placeholderIcon?: string
    icon?: string
    onClick?: () => void
}

const LibraryItem : React.FC<ILibraryItemProps> = props => {
    return <ImageSelector placeholderIcon={props.placeholderIcon} onClick={ props.onClick ? props.onClick : () => {} } image={ props.image } text={props.title} icon={props.icon} iconSize={props.iconSize} />
}

interface ILibraryComposition {
    Item: React.FC<ILibraryItemProps>;
}

export interface ILibraryProps { 
    id?: string
    currentPage?: number
    lastPage?: number,
    hasPagination?: boolean
    onPageChange?: (newPage: number) => void
}

interface ITreeViewState { }

const LibraryContext = React.createContext<ITreeViewState | undefined>(undefined)

const Library : React.FC<ILibraryProps> & ILibraryComposition = props => {

    const isValueInStart = (val: number) => val <= 3
    const isValueInEnd = (val: number) => val >= props.lastPage - 2
    const isValueInExtreme = (val: number) => isValueInStart(val) || isValueInEnd(val)
    const doesPageHitStart = (page: number) => page - 3 <= 3
    const doesPageHitEnd = (page: number) => page + 2 >= props.lastPage - 3

    var nextArr = [ 1, 2, 3 ]
    var exPrevArr = [ 2, 1 ]
    var nextExArr = [ 1, 2 ]
    var inPrevArr = [ 2, 1, 0 ]

    return (
        <LibraryContext.Provider value={undefined}>
            <div id={props.id} className="element-library">
                <div className="element-items">
                    { props.children }
                </div>
                { props.hasPagination ?
                    <div className="element-pagination">
                        <Button onClick={() => props.currentPage > 1 ? props.onPageChange(props.currentPage - 1) : () => {}} text="prev"/>
                        { nextArr.map((v, i) => v > props.lastPage ? <></> : <Button onClick={() => props.onPageChange(v)} key={i} text={v.toString()} holding={props.currentPage == v}/>) }
                        { doesPageHitStart(props.currentPage) ? <></> : <span>...</span>}
                        { exPrevArr.map((v, i) => isValueInExtreme(props.currentPage - v) ? <></> : <Button onClick={() => props.onPageChange(props.currentPage - v)} key={i} text={(props.currentPage - v).toString()}/>) }
                        { isValueInExtreme(props.currentPage) ? <></> : <Button onClick={() => props.onPageChange(props.currentPage)} text={props.currentPage.toString()} holding={true}/> }
                        { nextExArr.map((v, i) => isValueInExtreme(props.currentPage + v) ? <></> : <Button key={i} onClick={() => props.onPageChange(props.currentPage + v)} text={(props.currentPage + v).toString()}/>) }
                        { doesPageHitEnd(props.currentPage) ? <></> : <span>...</span>}
                        { inPrevArr.map((v, i) => props.lastPage - v <= 3 ? <></> : <Button key={i} onClick={() => props.onPageChange(props.lastPage - v)} text={ (props.lastPage - v).toString() } holding={props.currentPage == props.lastPage - v}/>) }
                        <Button onClick={() => props.currentPage + 1 <= props.lastPage ? props.onPageChange(props.currentPage + 1) : () => {}} text="next"/>
                    </div> : <></> }
            </div>
        </LibraryContext.Provider>
    )
}

Library.Item = LibraryItem
Library.defaultProps = {
    lastPage: 1,
    currentPage: 1,
    hasPagination: false,
}

export default Library