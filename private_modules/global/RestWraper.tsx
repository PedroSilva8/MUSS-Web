import Networking from "@global/Networking";
import RestHelper, { RestResponse } from "@global/RestHelper"

export interface IGet<T> {
    token?: string
    index?: number
    arguments?: { [key: string]: string; }
    additional?: string
    onSuccess: (Data: T) => void
    onError: (Data: RestResponse) => void
}

export interface IGetAll<T> {
    token?: string
    custom?: string
    onSuccess: (Data: T[]) => void
    onError: (Data: RestResponse) => void
}

export interface IGetWhere<T> {
    token?: string
    arguments?: { [key: string]: string; }
    onSuccess: (Data: T[]) => void
    onError: (Data: RestResponse) => void
}

export interface IUpdate<T> {
    token?: string
    index: number
    data: T
    onSuccess: (Data: RestResponse) => void
    onError: (Data: RestResponse) => void
}

export interface IUpdateFile {
    token?: string
    index: number
    files: { [key: string]: string; }
    onSuccess: () => void
    onError: (Data: RestResponse) => void
}

export interface IUpdateImage {
    token?: string
    index: number
    file: string
    onSuccess: () => void
    onError: (Data: RestResponse) => void
}

export interface ICreate<T> {
    token?: string
    data: T
    onSuccess: (Data: T) => void
    onError: (Data: RestResponse) => void
}

export interface ICreateWFiles<T> {
    token?: string
    data: T
    files: { [key: string]: string; }
    onSuccess: (Data: T) => void
    onError: (Data: RestResponse) => void
}

export interface IDelete {
    token?: string
    index: number
    onSuccess: () => void
    onError: (Data: RestResponse) => void
}

export default class RestWraper<T> {
    Target: string = ""

    constructor(target: string) { this.Target = target }

    DataToValue = (data:any) : T | undefined => {
        if (!data || !data.hasOwnProperty("id"))
            return undefined;
        return data;
    }

    DataToArray = (data: any) => {
        var List: T[] = [];

        data.forEach((value: any) => {
            var val = this.DataToValue(value)
            if (val)
                List.push(val)
        });

        return List;
    }

    Get = (props:IGet<T>) => {
        if (props.index)
            RestHelper.GetItemData({
                id: props.index,
                target: this.Target + (props.additional ? props.additional : ""),
                arguments: { token: props.token },
                onSuccess: (data) => props.onSuccess(this.DataToArray(data.data)[0]),
                onError: props.onError
            });
        else
            RestHelper.GetItems({
                arguments: { token: props.token },
                target: this.Target + (props.additional ? props.additional : ""),
                onSuccess: (data) => props.onSuccess(this.DataToArray(data.data)[0]),
                onError: props.onError
            })
    }

    GetAll = (props:IGetAll<T>) => {
        RestHelper.GetItems({
            target: this.Target + (props.custom ? props.custom : ""),
            arguments: { token: props.token },
            onSuccess: (data) => props.onSuccess(this.DataToArray(data.data)),
            onError: props.onError
        });
    }

    GetWhere = (props:IGetWhere<T>) => {
        RestHelper.GetItems({
            target: this.Target,
            arguments: { ...props.arguments, ...(props.token && { token: props.token } ) },
            onSuccess: (data) => props.onSuccess(this.DataToArray(data.data)),
            onError: props.onError
        });
    }

    Update = (props:IUpdate<T>) => {
        RestHelper.UpdateItems({
            id: props.index,
            target: this.Target,
            Values: { ...props.data, ...(props.token && { token: props.token } ) },
            onSuccess: props.onSuccess,
            onError: props.onError
        })
    }

    UpdateFile = (props:IUpdateFile) => {
        RestHelper.UpdateFile({
            id: props.index,
            target: this.Target,
            arguments: { ...(props.token && { token: props.token } ) },
            fileData: props.files,
            onSuccess: (data) => props.onSuccess(),
            onError: props.onError
        })
    }

    UpdateImage = (props:IUpdateImage) => {
        RestHelper.UpdateFile({
            id: props.index,
            target: this.Target,
            arguments: { ...(props.token && { token: props.token } ) },
            fileData: { image: props.file },
            onSuccess: (data) => props.onSuccess(),
            onError: props.onError
        })
    }

    Create = (props:ICreate<T>) => {
        RestHelper.CreateItem({
            target: this.Target,
            Values: { ...props.data, ...(props.token && { token: props.token } ) },
            onSuccess: (data) => props.onSuccess(this.DataToArray(data.data)[0]),
            onError: props.onError
        })
    }

    ProcessFiles = async (files: { [key: string]: string; }) => {
        const promises = []
        
        for (var key in files)
            promises.push(new Promise(resolve => {
                Networking.asyncFileToArgument({
                    file: files[key],
                    onSucess: (data) => resolve({[key]: data})
                })
            }))

        return Promise.all(promises)
    }

    CreateWFiles = (props:ICreateWFiles<T>) => {
        RestHelper.CreateItem({
            target: this.Target,
            Values: { ...props.data, ...props.files, ...(props.token && { token: props.token } ) },
            onSuccess: (data) => props.onSuccess(this.DataToArray(data.data)[0]),
            onError: props.onError
        })
    }

    Delete = (props:IDelete) => {
        RestHelper.DeleteItem({
            target: this.Target,
            id: props.index,
            arguments: { ...(props.token && { token: props.token } ) },
            onSuccess: props.onSuccess,
            onError: props.onError
        })
    }

    GetImage = (index: number) : string => `${RestHelper.baseURL}${this.Target}/${index}/image`
    GetFile = (index: number, file: string) : string => `${RestHelper.baseURL}${this.Target}/${index}/${file}` 
}