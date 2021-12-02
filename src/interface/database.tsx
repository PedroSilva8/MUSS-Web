export interface IMusicContext {
    music: IMusic
    setMusic?: (music: IMusic) => void
}

export interface IArtist {
    id: number
    name: string
}

export interface IAlbum {
    [key: string]: number | string;
    id: number
    artist_id: number
    name: string
    description: string
}

export interface IMusic {
    [key: string]: number | string;
    id: number
    album_id: number
    name: string
    description: string
    length: string
}

const defaultIMusic : IMusic = { id: -1, album_id: -1, name: "", description: "", length: "00:00:00" }

export { defaultIMusic }