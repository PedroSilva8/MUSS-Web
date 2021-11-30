import $ from 'jquery'
import { compress } from 'lz-string';
import { compressToUTF16 } from 'async-lz-string';

interface ISendRequestProps {
    url: string
    data?: any
    async?: boolean
    type?: 'POST' | 'GET' | 'DELETE' | 'PUT'
    onSuccess?:(data: any) => void
    onError?:(data: any) => void
}

interface ISendFiles {
    url: string
    uploadType: 'POST' | 'PUT'
    file: string
    onSuccess?:(data: any) => void
    onError?:(data: any) => void
}

interface IFileToArgument { 
    file: string, 
    onSucess?: (file: string) => void, 
    onError?: (data: any) => void 
}

export default class Networking {

    static baseURL : string = 'http://localhost:3000/api/';

    public static asyncFileToArgument = (props: IFileToArgument) => compressToUTF16(props.file).then((val) => props.onSucess(escape(val)), props.onError)
    
    public static fileToArgument = (file: string) => {
        return escape(compress(file))
    }

    static sendRequest = (props: ISendRequestProps) : void => {
        $.ajax({
            url: props.url,
            type: props.type,
            data: props.data,
            async: props.async,
            dataType: 'json',
            crossDomain: true,
            success: props.onSuccess,
            error: props.onError})
    }

    static sendFile = (props: ISendFiles) : void => {
        //this.asyncFileToArgument({
        //    file: props.file,
        //    onSucess: (file) => {
        //        Networking.sendRequest({
        //            url: props.url,
        //            data: { file: file },
        //            type: props.uploadType,
        //            onSuccess: props.onSuccess,
        //            onError: props.onError
        //        })
        //    },
        //    onError: props.onError
        //})
        Networking.sendRequest({
            url: props.url,
            data: { file: props.file },
            type: props.uploadType,
            onSuccess: props.onSuccess,
            onError: props.onError
        })
    }

    static isValidHttpUrl = (value: string) : boolean => {
        let url
                
        try { url = new URL(value) } catch (_) { return false }
      
        return url.protocol === "http:" || url.protocol === "https:"
    }

    static isBlobURL = (value: string) : boolean => value.search('blob:') == 1
}