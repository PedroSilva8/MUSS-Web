import Networking from '@global/Networking'
import { IndexKind } from 'typescript';

export interface RestResponse {
    isValid: boolean
    status: number
    data: any
    other: any
}

export interface IGenericRest {
    target: string,
    arguments?: any
    onSuccess: (Data: RestResponse) => void
    onError: (Data: RestResponse) => void
}

export interface IGenericRestIndexed {
    target: string
    targetExtra?: string
    id: IndexKind
    arguments?: any
    onSuccess: (Data: RestResponse) => void
    onError: (Data: RestResponse) => void
}

export interface IUpdateFile {
    target: string
    id: IndexKind
    fileData: { [key: string]: string; }
    arguments?: any
    onSuccess?: (Data: RestResponse) => void
    onError?: (Data: RestResponse) => void
}

export default class RestHelper {
    static apiVersion: number = 1;
    static baseURL: string = `${Networking.baseURL}${RestHelper.apiVersion}/`;

    static DataToResponse = (Data: any) : RestResponse => {
        if (!Data.hasOwnProperty("status") || isNaN(parseInt(Data["status"])))
            return { isValid: false, status:0, data: "", other: {} }
        
        var extra: { [index: string]: any } = {}

        Object.keys(Data).forEach(element => {
            if (element != "status" && element != "data")
                extra[element] = Data[element]
        });

        return { isValid: true, status: parseInt(Data["status"]), data: Data["data"], other: extra }
    }

    static ErrorToResponse = (Data: any) : RestResponse => {
        if (!Data.responseJSON.hasOwnProperty("status") || isNaN(parseInt(Data.responseJSON["status"])) || !Data.responseJSON.hasOwnProperty("data"))
            return { isValid: false, status:-1, data: "", other: {} }
        
        return { isValid: true, status: parseInt(Data.responseJSON["status"]), data: Data.responseJSON["data"], other: {} }
    }

    static GetPages = (props: IGenericRest) => {
        Networking.sendRequest({
            url: `${RestHelper.baseURL}${props.target}/pages`,
            type: 'GET',
            data: props.arguments,
            onSuccess: (Data) => {
                var Response = RestHelper.DataToResponse(Data);
                if (!Response.isValid || Response.status != 0)
                    props.onError(Response)
                else if (props.onSuccess)
                    props.onSuccess(Response)
            },
            onError: (Data) => props.onError(RestHelper.ErrorToResponse(Data))
        })
    }

    static GetItems = (props: IGenericRest) => {
        Networking.sendRequest({
            url: `${RestHelper.baseURL}${props.target}`,
            type: 'GET',
            data: props.arguments,
            onSuccess: (Data) => {
                var Response = RestHelper.DataToResponse(Data);
                if (!Response.isValid || Response.status != 0)
                    props.onError(Response)
                else if (props.onSuccess)
                    props.onSuccess(Response)
            },
            onError: (Data) => {
                if (props.onError)
                    props.onError(RestHelper.ErrorToResponse(Data));
            }
        });
    }

    static CreateItem = (props: IGenericRest) => {
        Networking.sendRequest({
            url: `${RestHelper.baseURL}${props.target}/`,
            type: 'POST',
            data: props.arguments,
            onSuccess: (Data) => {
                var Response = RestHelper.DataToResponse(Data);
                if (!Response.isValid || Response.status != 0)
                    props.onError(Response)
                else
                    props.onSuccess(Response)
            },
            onError: (Data) => props.onError(RestHelper.ErrorToResponse(Data))
        });
    }

    static GetItemData = (props: IGenericRestIndexed) => {
        Networking.sendRequest({
            url: `${RestHelper.baseURL}${props.target}/${props.id}`,
            type: 'GET',
            data: props.arguments,
            onSuccess: (Data) => {
                var Response = RestHelper.DataToResponse(Data);
                if (!Response.isValid || Response.status != 0)
                    props.onError(Response)
                else
                    props.onSuccess(Response)
            },
            onError: (Data) => props.onError(RestHelper.ErrorToResponse(Data))
        });
    }

    static GetImage = (target: string, id: Number) => {
        return `${RestHelper.baseURL}${target}/${id}/Image`
    }

    static UpdateItems = (props: IGenericRestIndexed) => {

        var targetExtra = (props.targetExtra ? props.targetExtra : "")

        Networking.sendRequest({
            url: `${RestHelper.baseURL}${props.target}/${props.id}${targetExtra}`,
            type: 'PUT',
            data: props.arguments,
            onSuccess: (Data) => {
                var Response = RestHelper.DataToResponse(Data);
                if (!Response.isValid || Response.status != 0)
                    props.onError(Response)
                else
                    props.onSuccess(Response)
            },
            onError: (Data) => props.onError(RestHelper.ErrorToResponse(Data))
        });
    }

    static UpdateFile = (props: IUpdateFile) => {
        for (let key in props.fileData) {
            Networking.sendFile({
                url: `${RestHelper.baseURL}${props.target}/${props.id}/${key}`,
                uploadType: 'PUT',
                data: props.arguments,
                file: props.fileData[key],
                onSuccess: (Data) => {
                    var Response = RestHelper.DataToResponse(Data)
                    if (!Response.isValid || Response.status != 0)
                            props.onError(Response)
                    else
                        props.onSuccess(Response)
                },
                onError: (Data) => props.onError(RestHelper.ErrorToResponse(Data))
            });
        }
    }

    static DeleteItem = (props:IGenericRestIndexed) => {
        Networking.sendRequest({
            url: `${RestHelper.baseURL}${props.target}/${props.id}`,
            data: props.arguments,
            type: 'DELETE',
            onSuccess: (Data) => {
                var Response = RestHelper.DataToResponse(Data);
                if (!Response.isValid || Response.status != 0) 
                    props.onError(Response)
                else
                    props.onSuccess(Response)
            },
            onError: (Data) => props.onError(RestHelper.ErrorToResponse(Data))
        });
    }
}