import React from "react";

import ImageSelector from '@elements/ImageSelector'
import RestWraper from "@modules/global/RestWraper";

import './itemselector.scss'

export interface IItemSelectorProps {
    database: string
    textColumn: string
    onSelect: (id: number) => void
}

export interface IItemSelectorState<T> { 
    items: T[]
}

export default class ItemSelector<T extends { [index: string] : any } > extends React.Component<IItemSelectorProps, IItemSelectorState<T>> {

    rest : RestWraper<T> | undefined = undefined

    public static defaultProps = {
        onSelect: () => {}
    };

    constructor(props: IItemSelectorProps) {
        super(props)
        this.state = { items: [] }
    }

    componentDidMount = () => {
        this.rest = new RestWraper<T>(this.props.database)
        this.rest.GetAll({
            onSuccess: (data) => this.setState({items: data}),
            onError:() => {}
        })
    }

    render = () => {
        return (
            <div className="element-item-selector">
                {this.state.items.map((val : any, i) => <ImageSelector key={i} image={this.rest.GetImage(val["id"])} onClick={() => { this.props.onSelect(val["id"]) }} text={(val[this.props.textColumn] ? val[this.props.textColumn] : "")}/>)}
            </div>
        );
    }
}