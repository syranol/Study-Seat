export interface IHttpRequest {

}

export interface IHttpResponse {
    header: (...args: string[]) => void,
    sendFile: (path: string) => void,
    send: (response: unknown) => void,
    json: (object: object) => { }
}