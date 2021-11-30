import Networking from "@global/Networking";
import RestHelper, { RestResponse } from "@global/RestHelper"

export interface IGet<T> {
    index: number
    onSuccess: (Data: T) => void
    onError: (Data: RestResponse) => void
}

export interface IGetAll<T> {
    onSuccess: (Data: T[]) => void
    onError: (Data: RestResponse) => void
}

export interface IGetWhere<T> {
    arguments?: { [key: string]: string; }
    onSuccess: (Data: T[]) => void
    onError: (Data: RestResponse) => void
}

export interface IUpdate<T> {
    index: number
    data: T
    onSuccess: (Data: RestResponse) => void
    onError: (Data: RestResponse) => void
}

export interface IUpdateFile<T> {
    index: number
    files: { [key: string]: string; }
    onSuccess: () => void
    onError: (Data: RestResponse) => void
}

export interface IUpdateImage<T> {
    index: number
    file: string
    onSuccess: () => void
    onError: (Data: RestResponse) => void
}

export interface ICreate<T> {
    data: T
    file: string
    onSuccess: (Data: T) => void
    onError: (Data: RestResponse) => void
}

export interface ICreateWFiles<T> {
    data: T
    files: { [key: string]: string; }
    onSuccess: (Data: T) => void
    onError: (Data: RestResponse) => void
}

export interface IDelete<T> {
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
        RestHelper.GetItemData({
            id: props.index,
            target: this.Target,
            onSuccess: (data) => props.onSuccess(this.DataToArray(data.data)[0]),
            onError: props.onError
        });
    }

    GetAll = (props:IGetAll<T>) => {
        RestHelper.GetItems({
            target: this.Target,
            onSuccess: (data) => props.onSuccess(this.DataToArray(data.data)),
            onError: props.onError
        });
    }

    GetWhere = (props:IGetWhere<T>) => {
        RestHelper.GetItems({
            target: this.Target,
            arguments: props.arguments,
            onSuccess: (data) => props.onSuccess(this.DataToArray(data.data)),
            onError: props.onError
        });
    }

    Update = (props:IUpdate<T>) => {
        RestHelper.UpdateItems({
            id: props.index,
            target: this.Target,
            Values: props.data,
            onSuccess: props.onSuccess,
            onError: props.onError
        })
    }

    UpdateFile = (props:IUpdateFile<T>) => {
        RestHelper.UpdateFile({
            id: props.index,
            target: this.Target,
            fileData: props.files,
            onSuccess: (data) => props.onSuccess(),
            onError: props.onError
        })
    }

    UpdateImage = (props:IUpdateImage<T>) => {
        RestHelper.UpdateFile({
            id: props.index,
            target: this.Target,
            fileData: { image: props.file },
            onSuccess: (data) => props.onSuccess(),
            onError: props.onError
        })
    }

    Create = (props:ICreate<T>) => {
        //Networking.asyncFileToArgument({
        //    file: props.file,
        //    onSucess: (file) => {
        //        RestHelper.CreateItem({
        //            target: this.Target,
        //            Values: {...props.data, ...{ file: file }},
        //            onSuccess: (data) => props.onSuccess(this.DataToArray(data.data)[0]),
        //            onError: props.onError
        //        })
        //    },
        //    onError: props.onError
        //})
        RestHelper.CreateItem({
            target: this.Target,
            Values: {...props.data, ...{ file: props.file }},
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
        //this.ProcessFiles(props.files).then((files) => {
        //    RestHelper.CreateItem({
        //        target: this.Target,
        //        Values: { ...props.data, ...files },
        //        onSuccess: (data) => props.onSuccess(this.DataToArray(data.data)[0]),
        //        onError: props.onError
        //    })
        //})
        RestHelper.CreateItem({
            target: this.Target,
            Values: { ...props.data, ...props.files },
            onSuccess: (data) => props.onSuccess(this.DataToArray(data.data)[0]),
            onError: props.onError
        })
    }

    Delete = (props:IDelete<T>) => {
        RestHelper.DeleteItem({
            target: this.Target,
            id: props.index,
            onSuccess: props.onSuccess,
            onError: props.onError
        })
    }

    GetImage = (index: number) : string => `${RestHelper.baseURL}${this.Target}/${index}/image`
    GetFile = (index: number, file: string) : string => `${RestHelper.baseURL}${this.Target}/${index}/${file}` 
}