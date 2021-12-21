export interface IArtist {
    id: number
    name: string
}

const defaultArtist : IArtist = { id: -1, name: "" }

export interface IAlbum {
    [key: string]: any;
    id: number
    artist_id: number
    name: string
    description: string
}

const defaultAlbum : IAlbum = { id: -1, artist_id: -1, name: "", description: "" }

export interface IMusic {
    [key: string]: any;
    id: number
    album_id: number
    name: string
    description: string
    length: string
}

const defaultMusic : IMusic = { id: -1, album_id: -1, name: "", description: "", length: "00:00:00" }

export interface IUser {
    [key: string]: any;
    id: number
    name: string
    password: string
    isAdmin: boolean
}

const defaultUser : IUser = { id: -1, name: "", password: "", isAdmin: false }

export interface IPlaylist {
    [key: string]: any;
    id: number
    userId: number
    name: string
    description: string
}

const defaultPlaylist : IPlaylist = { id: -1, userId: -1, name: "", description: "" }

export { defaultMusic, defaultUser, defaultArtist, defaultAlbum, defaultPlaylist }