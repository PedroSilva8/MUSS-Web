import React, { useEffect, useState } from "react"

import Library from '@elements/Library'
import Popup from '@elements/Popup'
import Input from "@elements/Input"

import RestWraper from "@global/RestWraper"
import NotificationManager from '@global/NotificationManager'

import './scss/dashboard.scss'

export interface IGetFiles {
    onSucess: (files: { [key: string]: string }) => void
    onError: () => void
}

export interface IGenericEditorState<T> { 
    /* Data */
    items: T[]
    originalItem: T | null
    selectedIndex: number
    search: string
    
    /* Pagination */
    currentPage: number
    lastPage: number
}

export interface IGenericEditorProps<T> {
    /* CSS */
    id: string
    placeholder?: string
    useImages: boolean

    /* Rest */
    restName: string
    token: string

    /* Items */
    canCreate: boolean
    selectedItem: T | null
    getFiles: (props: IGetFiles) => void
    onSelectItem: (item: T | null) => void
    onUnSelectItem: () => void

    /* Form */
    getTitle?: () => string
    isCreating?: 'true' | 'false' | 'hide'
    hasPagination: boolean
    usePopup: boolean
    children: any

    /* Form Buttons */
    onCreate?: () => void
    onUpdate?: () => void
    onDelete?: () => void

    /* Editor */
    isEditing: boolean
    onEditorChange: (newValue: boolean) => boolean
}


export default class ImageSelector<T extends { id: number, name: string }> extends React.Component<IGenericEditorProps<T>, IGenericEditorState<T>> {

    rest = new RestWraper<T>(this.props.restName)

    public static defaultProps = {
        id: "",
        useImages: true,
        canCreate: true,
        hasPagination: true,
        usePopup: true,
        getFiles: () => {},
        onSelectItem: () => {},
        onUnSelectItem: () => {}
    }

    constructor(props: IGenericEditorProps<T>) {
        super(props)
        this.state = {
            items: [],
            originalItem: null,
            selectedIndex: -1,
            currentPage: 0,
            lastPage: 1,
            search: ""
        }
    }

    componentDidMount = () => {
        this.props.hasPagination ? this.getPages() : () => { }
        this.getItems()
    }

    /* Data Functions */

    getItems = () => {
        this.rest.GetAll({
            page: this.state.currentPage,
            arguments: { ...( this.state.search != "" && { search: this.state.search } ) },
            onSuccess: (data) => this.setState({items: data}),
            onError: () => NotificationManager.Create('Error', 'Failed To Get Items', 'danger')
        })
    }

    onSelectItem = (index: number) => {
        if (index != -1)
        this.rest.Get({
                index: this.state.items[index].id,
                onSuccess: (Data) => {  
                    var ori = Object.assign({}, this.state.items[index])
                    this.state.items[index] = Data
                    this.setState({ ...this.state, items: this.state.items, selectedIndex: index, originalItem: ori})
                    this.props.onEditorChange(true)
                    this.props.onSelectItem(this.state.items[index])
                },
                onError: () => NotificationManager.Create('Error', 'Failed To Get Selected Item', 'danger')
            })
        else {
            this.props.onEditorChange(true)
            this.props.onSelectItem(null)
        }
    }

    onCreateItem = () => {
        this.props.getFiles({
            onSucess: (files) => {
                this.rest.CreateWFiles({
                    token: this.props.token,
                    data: this.props.selectedItem,
                    files: files,
                    onSuccess: (items) => { 
                        this.state.items.push(items)
                        this.setState({items: this.state.items, originalItem: null})
                        this.props.onEditorChange(false)
                        this.props.onUnSelectItem()
                        NotificationManager.Create("Success", "Success Updating Artist", 'success')
                    },
                    onError: () => NotificationManager.Create('Error', 'Failed To Saved Item', 'danger')
                })
            },
            onError: () => NotificationManager.Create('Error', 'Failed To Get Item File', 'danger')
        })
    }

    onUpdateItem = () => {
        this.rest.Update({
            index: this.props.selectedItem.id,
            token: this.props.token,
            data: this.props.selectedItem,
            onSuccess: (Result) => {
                this.setState({originalItem: this.props.selectedItem})
                NotificationManager.Create('Success', 'Sucessfully Saved Item', 'success')
            },
            onError: () => NotificationManager.Create('Error', 'Failed To Saved Item', 'danger')
        })
        this.props.getFiles({
            onSucess: (files) => {
                this.rest.UpdateFile({
                    index: this.props.selectedItem.id,
                    token: this.props.token,
                    files: files,
                    onSuccess: () => NotificationManager.Create('Success', 'Sucessfully Saved Item', 'success'),
                    onError: () => NotificationManager.Create('Success', 'Sucessfully Saved Item', 'success')
                })
            },
            onError: () => NotificationManager.Create('Error', 'Failed To Get Item File', 'danger')
        })        
    }

    onDeleteItem = () => {
        this.rest.Delete({
            index: this.props.selectedItem.id,
            token: this.props.token,
            onSuccess: () => {
                this.state.items.splice(this.state.selectedIndex, 1)
                this.setState({items: this.state.items, selectedIndex: -1, originalItem: null})
                this.props.onEditorChange(false)
                this.props.onUnSelectItem()
                NotificationManager.Create("success", "Success Deleting Artist", 'success')
            },
            onError: () => NotificationManager.Create("Error", "Error Deleting Artist", 'danger')
        })
    }

    /* Pagination Functions */
    getPages = () => {
        this.rest.GetPages({
            pageLength: 20,
            //Setting length inside setState causes state not to update for some reason
            onSuccess: (length) => { this.setState({lastPage: length}) },
            onError: () => NotificationManager.Create('Error', 'Error Failed To Get Album Pages', 'danger')
        })
    }

    onPageChange = (newPage: number) => this.setState({currentPage: newPage - 1})

    /* Editor Functions */

    getEditorTitle = () : string => this.props.getTitle ? this.props.getTitle() : this.props.selectedItem && this.props.selectedItem.id != -1 ? "Editing - " + this.props.selectedItem.name : "Create"
    
    RenderLibrary = () => {
        return (
            <Library hasPagination={this.props.hasPagination} onPageChange={this.onPageChange} currentPage={this.state.currentPage + 1} lastPage={this.state.lastPage}>
                { this.props.canCreate ? <Library.Item onClick={() => this.onSelectItem(-1)} iconSize={100} placeholderIcon="plus" icon="plus" title="New" /> : <></> }
                { this.state.items.map((val, index) => <Library.Item key={index} onClick={() => { this.onSelectItem(index); this.props.onEditorChange(true) }} iconSize={50} placeholderIcon={this.props.placeholder} icon="pencil" image={ this.props.useImages ? this.rest.GetImage(val.id) : undefined } title={ val.name }/> ) }
            </Library>
        )
    }

    onClosePopup = () => {
        if (!this.props.onEditorChange(false)) { 
            this.state.items[this.state.selectedIndex] = this.state.originalItem; 
            this.setState({items: this.state.items}) 
        }
    }

    onSearch = (v: string) => this.setState({...this.state, search: v, currentPage: 0}, () => { this.getItems() })

    render = () => {
        return (
            <div className="Dashboard">
                <Input icon="magnify" value={this.state.search} onChange={this.onSearch} placeholder="search"/>
                { this.props.usePopup ? 
                    <>
                        <this.RenderLibrary/>
                        <Popup isOpened={this.props.isEditing} >
                            <Popup.Header onClose={this.onClosePopup} title={this.getEditorTitle()} type="BACK" />
                            <Popup.Content id={this.props.id}>
                                { this.props.children }
                            </Popup.Content>
                            <Popup.Footer >
                                { this.props.isCreating && this.props.isCreating == 'false' || this.props.selectedItem && this.props.selectedItem.id != -1 && this.props.isCreating == null ?
                                    <>
                                        <Popup.Footer.Button text="Save" onClick={this.props.onUpdate ? this.props.onUpdate : this.onUpdateItem}/>
                                        <Popup.Footer.Button text="Delete" onClick={this.props.onDelete ? this.props.onDelete : this.onDeleteItem}/>
                                    </>:
                                    this.props.isCreating && this.props.isCreating == 'hide' ? <></> : <Popup.Footer.Button text="Create" onClick={this.props.onCreate ? this.props.onCreate : this.onCreateItem}/>
                                }
                            </Popup.Footer>
                        </Popup>
                    </> : this.props.isEditing ? <div id={this.props.id}>{this.props.children}</div> : <this.RenderLibrary/>}
            </div>
        )
    }
}