import React, { createRef, useContext } from "react"

import { defaultUser, IUser } from "@interface/database"

import NotificationManager from "@global/NotificationManager"

import Input from "@elements/Input"
import Switch from "@elements/Switch"

import userContext from "@context/AuthContext"

import GenericEditor from './genericEditor'

import './scss/user.scss'

interface IUsersPageState {
    user: IUser | null
    newPassword: string
    conPassword: string
    isEditing: boolean
}

const UsersPage = () => {
    const restName = "user"
    const { token } = useContext(userContext)

    const editor = createRef<GenericEditor<IUser>>()
    
    const [ state, setState ] = React.useState<IUsersPageState>({
        user: null,
        newPassword: "",
        conPassword: "",
        isEditing: false
    })

    const onEditorChange = (newValue: boolean) => {
        state.isEditing = newValue
        setState({...state, isEditing: state.isEditing})
        return newValue
    }

    const onSelectItem = (i: IUser | null) => {
        state.user = i ? i : defaultUser
        setState({...state, user: state.user})
    }

    const onCreate = () => {
        if (state.conPassword == "" || state.newPassword == "")
            return NotificationManager.Create('Error', 'Password Missing', 'danger')
        else if (state.conPassword != state.newPassword)
            return NotificationManager.Create('Error', 'Password Doesn\'t Match', 'danger')
        
        state.user.password = state.newPassword
        setState({...state})
        editor.current.onCreateItem()
    }

    const onUpdate = () => {
        if ((state.conPassword != "" || state.newPassword != "") && state.conPassword != state.newPassword)
            return NotificationManager.Create('Error', 'Password Doesn\'t Match', 'danger')
        
        state.user.password = state.newPassword
        setState({...state})
        editor.current.onUpdateItem()
    }

    return (
        <>
            <GenericEditor<IUser> id="UserDashboard" ref={editor} useImages={false} onCreate={onCreate} onUpdate={onUpdate} placeholder="account" restName={restName} token={token.token} getFiles={(p) => p.onSucess({})} onSelectItem={onSelectItem} selectedItem={state.user} isEditing={state.isEditing} onEditorChange={onEditorChange}>
                <Input label="Name" value={state.user?.name} onChange={(v) => { state.user.name = v; setState({...state, user: state.user}) }}/>
                <Input type="password" label="New Password" value={state.newPassword} onChange={(v) => setState({...state, newPassword: v})}/>
                <Input type="password" label="Confirm New Password" value={state.conPassword} onChange={(v) => setState({...state, conPassword: v})}/>
                <Switch label="Is Admin" onCheck={(checked) => { state.user.isAdmin = checked; setState({...state, user: state.user}) }} checked={ state.user?.isAdmin }/>
            </GenericEditor>
        </>
    );
}

export default UsersPage