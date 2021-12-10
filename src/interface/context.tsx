import { IMusic, IUser } from '@interface/database'

export interface IMusicContext {
    music: IMusic
    setMusic?: (music: IMusic) => void
}

export interface IUserContext {
    user: IUser
    token: string
    setUser?: (user: IUser) => void
    setToken?: (token: string) => void
}