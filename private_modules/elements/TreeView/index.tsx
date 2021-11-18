import React from "react";
import Icon from "../Icon";

import './treeview.scss'

export interface ITreeViewOptionProps { 
    icon?: string
    onClick?: () => void
    content: string
}

const TreeViewOption = (props: ITreeViewOptionProps) : React.ReactElement => {
    return (
        <div className="element-treeview-option" onClick={props.onClick}>
            { props.icon ? <Icon icon={props.icon} /> : <></> }
            <span>{ props.content }</span>
        </div>
    )
}

export interface ITreeViewHeaderProps { 
    title: string
}

interface ITreeViewHeaderState { }

const ITreeViewHeaderContext = React.createContext<ITreeViewHeaderState | undefined>(undefined)

interface ITreeViewHeaderContext {
    Option: React.FC<ITreeViewOptionProps>;
}


const TreeViewHeader : React.FC<ITreeViewHeaderProps> & ITreeViewHeaderContext = props => {
    return (
        <ITreeViewHeaderContext.Provider value={undefined}>
            <div className="element-treeview-header">
                <span>{ props.title }</span>
            </div>
            { props.children }
        </ITreeViewHeaderContext.Provider>
    )
}

TreeViewHeader.Option = TreeViewOption;

interface ITreeViewHeaderComposition {
    Header: React.FC<ITreeViewHeaderProps>  & ITreeViewHeaderContext;
}

export interface ITreeViewProps { }

interface ITreeViewState { }

const TreeViewContext = React.createContext<ITreeViewState | undefined>(undefined)

const TreeView : React.FC<ITreeViewProps> & ITreeViewHeaderComposition = props => {
    return (
        <TreeViewContext.Provider value={undefined}>
            <div className="element-treeview">
                { props.children }
            </div>
        </TreeViewContext.Provider>
    )
}

TreeView.Header = TreeViewHeader

export default TreeView