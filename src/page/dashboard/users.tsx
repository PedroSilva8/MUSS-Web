import React, { useContext, useEffect } from "react"

import { defaultUser, IUser } from "@interface/database"

import RestWraper from "@global/RestWraper"
import NotificationManager from "@global/NotificationManager"

import Library from "@elements/Library"
import Popup from "@elements/Popup"
import Input from "@elements/Input"
import Switch from "@elements/Switch"

import userContext from "@context/AuthContext"

interface IUsersPageState {
    users: IUser[]
    user: IUser
    newPassword: string
    conPassword: string
    selectedUser: number
    isEditorOpend: boolean
}

const UsersPage = () => {
    const { token } = useContext(userContext)
    
    const [ state, setState ] = React.useState<IUsersPageState>({
        users: [],
        user: defaultUser,
        newPassword: '',
        conPassword: '',
        selectedUser: -1,
        isEditorOpend: false
    })

    var restUser = new RestWraper<IUser>('user')

    useEffect(() => restUser.GetAll({
        token: token,
        onSuccess: (users) => setState({...state, users}),
        onError: () => NotificationManager.Create('Error', "Failed Getting Users", 'danger')
    }), [])

    const IsPasswordValid = () : boolean => {
        if (state.conPassword != state.newPassword)
            return false
        return true
    }

    const onCreateUser = () => {
        if (!IsPasswordValid()) {
            NotificationManager.Create('Error', "Failed Updating Users", 'danger')
            return
        }
        state.user.password = state.conPassword
        setState({...state, user: state.user})

        restUser.Create({
            token: token,
            data: state.user,
            onSuccess: (data) => { NotificationManager.Create('Success', 'Successfully Created User', 'success'); state.users.push(data); setState({...state, users: state.users}); popupGoBack() },
            onError: () => NotificationManager.Create('Error', "Failed Creating User", 'danger')
        })
    }

    const onSaveUser = () => {
        restUser.Update({
            index: state.user.id,
            token: token,
            data: state.user,
            onSuccess: () => { NotificationManager.Create('Success', 'Successfully Updated User', 'success'); state.users[state.selectedUser] = state.user; setState({...state, users: state.users}) },
            onError: (err) => NotificationManager.Create('Error', "Failed Updating User - " + err.data, 'danger')
        })
    }

    const onDeleteUser = () => {
        restUser.Delete({
            index: state.user.id,
            token: token,
            onSuccess: () => { NotificationManager.Create('Success', 'Successfully Updated User', 'success'); state.users.splice(state.selectedUser, 1); setState({...state, users: state.users, isEditorOpend: false, selectedUser: -1}); popupGoBack() },
            onError: (err) => NotificationManager.Create('Error', "Failed Deliting User - " + err.data, 'danger')
        })
    }

    const selectUser = (index: number) => {
        state.user.id = state.users[index].id
        state.user.name = state.users[index].name
        state.user.password = state.users[index].password
        state.user.isAdmin = state.users[index].isAdmin

        setState({...state, selectedUser: index, user: state.user, isEditorOpend: true})
    }

    const getPopupTitle = () => {
        if (state.user.id != -1)
            return "Edit " + state.user.name
        return "Create New User"
    }

    const popupGoBack = () => {
        state.user = defaultUser
        setState({...state, isEditorOpend: false, user: state.user})
    }

    return (
        <>
            <Library>
                <Library.Item iconSize={100} onClick={() => setState({...state, selectedUser: -1, isEditorOpend: true})} placeholderIcon="plus" icon="plus" title="New"/>
                { state.users.map((val, i) => <Library.Item placeholderIcon="account" onClick={() => selectUser(i)} key={i} iconSize={50} icon="pencil" title={val.name}/>) }
            </Library>
            <Popup isOpened={state.isEditorOpend} >
                <Popup.Header onClose={popupGoBack} title={getPopupTitle()} type="BACK" />
                <Popup.Content id="MusicDashboard">
                    <Input label="Name" value={state.user.name} onChange={(v) => { state.user.name = v; setState({...state, user: state.user}) }}/>
                    <Input type="password" label="New Password" value={state.newPassword} onChange={(v) => setState({...state, newPassword: v})}/>
                    <Input type="password" label="Confirm New Password" value={state.conPassword} onChange={(v) => setState({...state, conPassword: v})}/>
                    <Switch label="Is Admin" onCheck={(checked) => { state.user.isAdmin = checked; setState({...state, user: state.user}) }} checked={ state.user.isAdmin }/>
                </Popup.Content>
                <Popup.Footer>
                    { state.selectedUser == -1 ? 
                        <Popup.Footer.Button onClick={onCreateUser} text="Create"/>:
                        state.selectedUser >= 0 ?
                        <>
                            <Popup.Footer.Button onClick={onSaveUser} text="Save"/>
                            <Popup.Footer.Button onClick={onDeleteUser} text="Delete"/>
                        </>:<></>
                    }
                </Popup.Footer>
            </Popup>
        </>
    );
}

export default UsersPage