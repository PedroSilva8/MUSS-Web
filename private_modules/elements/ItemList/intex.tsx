import React from "react";
import Icon from "../Icon";
import ImageSelector from "../ImageSelector";

import './itemList.scss'

export interface IItemListItemProps { 
    title?: string
    image?: string
    iconSize?: number
    icon?: string
    onClick?: () => void
}

const ItemListItem : React.FC<IItemListItemProps> = props => {
    return <ImageSelector onClick={ props.onClick ? props.onClick : () => {} } image={ props.image } text={props.title} icon={props.icon} iconSize={props.iconSize} />
}

interface IItemListComposition {
    Item: React.FC<IItemListItemProps>
}

export interface IItemListProps { 
    title: string
}

const ItemList : React.FC<IItemListProps> & IItemListComposition = props => {
    return (
        <div className="element-item-list">
            <h3>{props.title}</h3>
            <div className="element-item-list-wrap">
                <div className="element-item-list-items">
                    { props.children }
                </div>
            </div>
        </div>
    )
}

ItemList.Item = ItemListItem

export default ItemList