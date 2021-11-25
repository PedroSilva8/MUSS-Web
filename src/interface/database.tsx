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
}