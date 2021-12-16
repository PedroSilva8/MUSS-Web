import { IMusic, IUser } from '@interface/database'

export interface IMusicContext {
    music: IMusic
    setMusic?: (music: IMusic) => void
}

export interface Token {
    token: string,
    isLoaded: boolean
}

export interface IUserContext {
    user: IUser
    token: Token
    setUser?: (user: IUser) => void
    setToken?: (token: Token) => void
}