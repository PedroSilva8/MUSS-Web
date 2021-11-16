import Networking from "@global/Networking";
import RestHelper, { RestResponse } from "@global/RestHelper"

export interface IArtist {
    id: number
    name: string
}

export interface IArtistArray extends Array<IArtist>{}

export interface IGetArtists {
    onSuccess: (Data: IArtistArray) => void
    onError: (Data: RestResponse) => void
}

export interface IUpdateArtist {
    data: IArtist
    onSuccess: (Data: RestResponse) => void
    onError: (Data: RestResponse) => void
}

export interface IUpdateImageArtist {
    data: IArtist
    file: string
    onSuccess: () => void
    onError: (Data: RestResponse) => void
}

export interface ICreateArtist {
    data: IArtist
    file: string
    onSuccess: (Data: IArtist) => void
    onError: (Data: RestResponse) => void
}

export interface IDeleteArtist {
    data: IArtist
    onSuccess: () => void
    onError: (Data: RestResponse) => void
}

export default class RestArtist {
    static Target: string = "artist"

    static DataToValue = (data:any) : IArtist => {
        if (!data || !data.hasOwnProperty("id"))
            return { id: -1, name: "" };
        return data;
    }

    static DataToArray = (data: any) => {
        var List: IArtistArray = [];

        data.forEach((value: any) => List.push(RestArtist.DataToValue(value)));

        return List;
    }

    static Get = (props:IGetArtists) => {
        RestHelper.GetItems({
            target: RestArtist.Target,
            onSuccess: (data) => props.onSuccess(RestArtist.DataToArray(data.data)),
            onError: props.onError
        });
    }

    static Update = (props:IUpdateArtist) => {
        RestHelper.UpdateItems({
            id: props.data.id,
            target: RestArtist.Target,
            Values: {
                name: props.data.name
            },
            onSuccess: props.onSuccess,
            onError: props.onError
        })
    }

    static UpdateImage = (props:IUpdateImageArtist) => {
        RestHelper.UpdateFile({
            id: props.data.id,
            target: RestArtist.Target,
            fileData: props.file,
            fileName: "image",
            onSuccess: (data) => props.onSuccess(),
            onError: props.onError
        })
    }

    static Create = (props:ICreateArtist) => {
        RestHelper.CreateItem({
            target: RestArtist.Target,
            Values: {
                name: props.data.name,
                file: Networking.file2Argument(props.file)
            },
            onSuccess: (data) => props.onSuccess(RestArtist.DataToArray(data.data)[0]),
            onError: props.onError
        })
    }

    static Delete = (props:IDeleteArtist) => {
        RestHelper.DeleteItem({
            target: RestArtist.Target,
            id: props.data.id,
            onSuccess: props.onSuccess,
            onError: props.onError
        })
    }

    static GetImage = (props: IArtist) : string => `${RestHelper.baseURL}${this.Target}/${props.id}/image` 
}